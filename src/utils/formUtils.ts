export const meaningTemplate = { id: "", definition: "", example: "" };

export const categoryTemplate = {
  id: "",
  name: "",
  wordId: "",
  meanings: [meaningTemplate],
};

export const formTemplate = {
  id: "",
  createdById: "",
  name: "",
  shareCode: null,
  transcription: "",
  categories: [categoryTemplate],
};
