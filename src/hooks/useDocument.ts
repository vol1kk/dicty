import { useEffect, useState } from "react";

export default function useDocument() {
  const [_document, setDocument] = useState<Document | null>(null);

  useEffect(() => setDocument(document), []);

  return _document;
}
