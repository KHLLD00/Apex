import { Coupon } from "@/types";

export const coupons: Coupon[] = [
  { code: "APEX10", type: "percent", value: 10 },
  { code: "WELCOME5000", type: "flat", value: 5000, minSubtotal: 30000 },
  { code: "FREESHIP", type: "flat", value: 0 }, // handled specially: waives delivery
];
