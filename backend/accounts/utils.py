
from pathlib import Path
from pypdf import PdfReader
from docx import Document


def extract_resume_text(file):
    if not file:
        return ""

    extension = Path(file.name).suffix.lower()

    if extension == ".pdf":
        reader = PdfReader(file)

        text = "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    elif extension == ".docx":
        document = Document(file)

        text = "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

    else:
        return ""

    return text.strip()
