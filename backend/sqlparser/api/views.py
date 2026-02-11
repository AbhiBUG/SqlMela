import os
import tempfile
import zipfile
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from core.validator import validate_sql
from core.utils import save_json, save_sql, save_txt
from cli.cli import split_statements

class ValidateSQLView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        dialect = request.data.get('dialect', 'ansi')
        output_format = request.data.get('output')
        
        sources = []

        # Handle file upload
        if 'file' in request.FILES:
            uploaded_file = request.FILES['file']
            if uploaded_file.name.endswith('.zip'):
                try:
                    with zipfile.ZipFile(uploaded_file) as z:
                        for filename in z.namelist():
                            if filename.lower().endswith('.sql') and not filename.startswith('__MACOSX'):
                                with z.open(filename) as f:
                                    content = f.read().decode('utf-8', errors='replace')
                                    sources.append((filename, content))
                except zipfile.BadZipFile:
                    return Response({"error": "Invalid zip file"}, status=400)
            else:
                # Assume single SQL or text file
                content = uploaded_file.read().decode('utf-8', errors='replace')
                sources.append((uploaded_file.name, content))
        
        # Handle raw SQL input
        elif 'sql' in request.data:
            sources.append(('Raw Input', request.data['sql']))

        if not sources:
            return Response({"error": "No SQL content provided"}, status=400)

        results = []
        for source_name, sql_content in sources:
            statements = split_statements(sql_content)
            for stmt in statements:
                validation_result = validate_sql(stmt, dialect=dialect)
                results.append({
                    "source": source_name,
                    "statement": stmt,
                    "result": validation_result
                })

        # Handle file output if requested
        if output_format:
            output_format = output_format.lower()
            if output_format not in ['json', 'sql', 'txt']:
                return Response({"error": "Invalid output format. Options: json, sql, txt"}, status=400)
            
            fd, tmp_path = tempfile.mkstemp(suffix=f".{output_format}")
            os.close(fd)
            
            try:
                if output_format == 'json':
                    save_json(results, tmp_path)
                elif output_format == 'sql':
                    save_sql(results, tmp_path)
                elif output_format == 'txt':
                    save_txt(results, tmp_path)
                
                return FileResponse(open(tmp_path, 'rb'), as_attachment=True, filename=f"results.{output_format}")
            except Exception as e:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
                return Response({"error": str(e)}, status=500)

        # Default JSON response
        response_data = []
        for r in results:
            # Flatten structure slightly for JSON response to match previous behavior/expectations or keep it structured
            # Using the structure compatible with core/utils logic
            response_data.append(r)

        return Response({"results": response_data})