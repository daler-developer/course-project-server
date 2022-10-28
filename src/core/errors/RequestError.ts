export default class extends Error {
  constructor(
    message: string,
    public status: number,
    public errorType: string,
  ) {
    super(message);
  }
}
