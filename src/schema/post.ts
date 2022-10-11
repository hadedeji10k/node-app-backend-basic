export const createPostSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "content", "description", "thumbnailUrl"],
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    description: { type: "string" },
    thumbnailUrl: { type: "string" },
  },
  errorMessage: {
    required: {
      title: "Title is required",
      content: "Content is required",
      description: "Description is required",
      thumbnailUrl: "Thumbnail is required",
    },
  },
};

export const updatePostSchema = {
  type: "object",
  additionalProperties: false,
  required: [],
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    description: { type: "string" },
    thumbnailUrl: { type: "string" },
  },
};