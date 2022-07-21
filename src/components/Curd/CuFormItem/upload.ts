import { UploadRequestOptions } from "element-plus";
import { http } from "/@/utils/http";

const uploaderHttp = (options: UploadRequestOptions) => {
  const formData = new FormData();
  formData.append("file", options.file);
  return http.post("/upload", {
    data: formData
  });
};

export { uploaderHttp };
