export class WebSocketConnector {
  private connection?: WebSocket;
  private url?: string;

  public getConnection(url: string): WebSocket {
    if (url !== this.url && this.connection) {
      this.connection.close();
    }

    this.url = url;
    this.connection = new WebSocket(url);

    return this.connection;
  }
}
