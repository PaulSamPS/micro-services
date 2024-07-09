export interface ReceivedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: { type: string; data: number[] }; // Описание структуры буфера
  size: number;
}
