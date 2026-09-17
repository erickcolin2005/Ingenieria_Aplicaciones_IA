# sync_skills.ps1 — copia skills/ hacia .claude/skills/
#
# La fuente de verdad es skills/. La herramienta lee .claude/skills/. Son dos
# copias, y esta es la razón: un enlace simbólico en Windows necesita permisos de
# administrador o el modo desarrollador activado, y no controlamos las máquinas del
# laboratorio. El costo de las dos copias es que se pueden desincronizar; por eso
# existe este script y por eso se corre antes de cada prueba de los skills.
#
#   pwsh -File sync_skills.ps1
#
# Equivalente en Mac/Linux:  rm -rf .claude/skills && cp -r skills .claude/skills

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$origen = Join-Path $raiz 'skills'
$destino = Join-Path $raiz '.claude\skills'

if (-not (Test-Path $origen)) { Write-Error "No existe $origen"; exit 1 }

if (Test-Path $destino) { Remove-Item -Recurse -Force $destino }
Copy-Item -Recurse $origen $destino

Get-ChildItem -Path $destino -Filter SKILL.md -Recurse | ForEach-Object {
  Write-Host ("  copiado  " + $_.Directory.Name + "/SKILL.md")
}
Write-Host "`nListo. Cierra la sesion y abre una nueva dentro de momento_1 para que los cargue."
