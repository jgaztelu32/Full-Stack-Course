import { authFetch } from "./api";

export const uploadFile = async ({ file, metadata }) => {
  const formData = new FormData();

  formData.append(
    "metadata",
    JSON.stringify(metadata)
  );
  formData.append("file", file);

  return authFetch("/files", {
    method: "POST",
    body: formData,
  });
};
