import pandas as pd
from docx import Document
from docx.shared import Inches


def open_csv(file_path, sep=',', encoding='utf-8') -> pd.DataFrame:
    """ Ouvre un fichier CSV et retourne un DataFrame pandas. """
    try:
        df = pd.read_csv(file_path, sep=sep, encoding=encoding)
        print(f"Fichier '{file_path}' ouvert avec succès.")
        return df
    except FileNotFoundError:
        print(f"Erreur : Le fichier '{file_path}' n'existe pas.")
    except pd.errors.EmptyDataError:
        print(f"Erreur : Le fichier '{file_path}' est vide.")
    except pd.errors.ParserError:
        print(f"Erreur : Le fichier '{file_path}' est mal formaté.")
    except Exception as e:
        print(f"Erreur inattendue : {e}")
    return None


def add_dataframe_to_docx(doc, df, title):
    """ Ajoute un DataFrame sous forme de tableau dans le document Word. """
    doc.add_heading(title, level=2)  # Ajouter un titre

    if df is not None and not df.empty:
        table = doc.add_table(rows=1, cols=len(df.columns))
        table.style = "Table Grid"

        # Ajouter les en-têtes
        hdr_cells = table.rows[0].cells
        for i, column_name in enumerate(df.columns):
            hdr_cells[i].text = column_name

        # Ajouter les lignes
        for _, row in df.iterrows():
            row_cells = table.add_row().cells
            for i, value in enumerate(row):
                row_cells[i].text = str(value)

        doc.add_paragraph()  # Ajouter un espace après le tableau
    else:
        doc.add_paragraph("Aucune donnée disponible pour ce tableau.\n")


def create_report(docx_path, csv_files):
    """ Génère un fichier Word contenant tous les CSV sous forme de tableaux. """
    doc = Document()
    doc.add_heading("Rapport de Données CSV", level=1)  # Titre principal

    for title, file_path in csv_files.items():
        df = open_csv(file_path)  # Charger le CSV
        add_dataframe_to_docx(doc, df, title)  # Ajouter au document Word

    doc.save(docx_path)
    print(f"📄 Rapport généré avec succès : {docx_path}")


if __name__ == "__main__":
    docx_path = "data/processed/data_report.docx"
    
    # Dictionnaire des fichiers CSV
    csv_files = {
        "Finance": "data/raw/finance.csv",
        "Finance Métropole": "data/raw/finance_metropole.csv",
        "Présentation Générale": "data/raw/presentation_generale.csv",
        "Métropole": "data/raw/metropole.csv",
        "Maire": "data/raw/mayor.csv",
        "Président de Métropole": "data/raw/metropole_president.csv",
        "Projets Écologiques Collecte": "data/raw/green_projects.csv",
        "Projets Écologiques Métropole": "data/raw/green_metropole_projects.csv",
        "Projets Sociaux": "data/raw/social_projects.csv",
        "Projets Sociaux Métropole": "data/raw/social_metropole_projects.csv",
        "Budget": "data/raw/budget.csv",
        "Budget Métropole": "data/raw/budget_metropole.csv",
        "Comparaison Autres Clients": "data/raw/comparison_other_clients.csv",
    }

    create_report(docx_path, csv_files)
