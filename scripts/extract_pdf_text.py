from pypdf import PdfReader
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text_content = ""
    for page in reader.pages:
        text_content += page.extract_text() + "\n"
    return text_content

def extract_text_from_pdf_fitz(pdf_path):
    document = fitz.open(pdf_path)
    text_content = ""
    for page_num in range(document.page_count):
        page = document.load_page(page_num)
        text_content += page.get_text() + "\n"
    return text_content

# Example usage
import sys

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf_text.py <pdf_file_path>", file=sys.stderr)
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    try:
        extracted_text = extract_text_from_pdf(pdf_path)
        print(extracted_text)
    except Exception as e:
        print(f"Error using pypdf: {str(e)}", file=sys.stderr)
        sys.exit(1)
    
    # Fallback to PyMuPDF if pypdf fails
    try:
        extracted_text_fitz = extract_text_from_pdf_fitz(pdf_path)
        print(extracted_text_fitz)
    except Exception as e:
        print(f"Error using PyMuPDF: {str(e)}", file=sys.stderr)
        sys.exit(1)