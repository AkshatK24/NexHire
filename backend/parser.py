import pdfplumber


def extract_text_from_pdf(pdf_file):
    try:
        text = ""

        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return text

    except Exception as e:
        return f"PDF Error: {str(e)}"