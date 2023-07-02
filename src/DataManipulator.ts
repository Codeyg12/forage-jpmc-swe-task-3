import { ServerRespond } from "./DataStreamer";

// modify to match the changes on the schema in Graph.tsx
export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // both prices will follow the same formula of top_ask and top_bid divided in half
    const priceABC =
      (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF =
      (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1.05;
    const lowerBound = .95;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      // ternary to return which timestamp is higher
      timestamp:
        serverRespond[0].timestamp > serverRespond[1].timestamp
          ? serverRespond[0].timestamp
          : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      // ternary to return the ratio if its past the bounds otherwise remain undefined
      trigger_alert:
        ratio > upperBound || ratio < lowerBound ? ratio : undefined,
    };
  }
}
