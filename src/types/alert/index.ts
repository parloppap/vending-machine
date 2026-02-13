type AlertType = 'success' | 'error' | 'warning' | 'info' | null;

export interface AlertMessage {
  type: AlertType;
  text: string;
}
