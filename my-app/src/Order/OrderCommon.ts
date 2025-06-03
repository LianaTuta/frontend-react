import { OrderStep } from "../constants/OrderStepEnum.ts"

export function getOrderStepMessage(step: number): string {
  switch (step) {
    case OrderStep.Initial:
      return "Order initialized.";
    case OrderStep.Payment:
      return "Payment is pending.";
    case OrderStep.Order:
      return "Order is being processed.";
    case OrderStep.QrCode:
      return "QR code generated.";
    case OrderStep.Completed:
      return "Order completed successfully.";
    case OrderStep.Cancelled:
      return "Order was cancelled.";
    case OrderStep.Expired:
      return "Order expired — payment not completed.";
    default:
      return "Unknown order status.";
  }
}
