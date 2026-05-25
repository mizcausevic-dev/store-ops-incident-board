$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $accent2Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 188, 205))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 199, 255), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)
    $graphics.DrawString("STORE OPS INCIDENT BOARD", (New-Object System.Drawing.Font("Consolas", 18, [System.Drawing.FontStyle]::Bold)), $accentBrush, 92, 92)
    $graphics.DrawString($Title, (New-Object System.Drawing.Font("Segoe UI", 34, [System.Drawing.FontStyle]::Bold)), $textBrush, 92, 144)
    $graphics.DrawString($Subtitle, (New-Object System.Drawing.Font("Segoe UI", 18)), $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("•", (New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)), $accent2Brush, 108, $y)
        $graphics.DrawString($bullet, (New-Object System.Drawing.Font("Segoe UI", 18)), $textBrush, 138, $y + 2)
        $y += 84
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", (New-Object System.Drawing.Font("Segoe UI", 16)), $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Overview proof" `
    -Subtitle "Store incidents, SLA blockers, and recovery posture in one buyer-safe restaurant operations surface." `
    -Bullets @(
        "Incident queues stay tied to store and guest-promise pressure.",
        "SLA blockers map directly to required recovery evidence.",
        "Reopen posture is visible before dispatch and promo windows burn."
    )

New-ProofImage -Path (Join-Path $screenshots "02-incident-lane-proof.png") `
    -Title "Incident lane" `
    -Subtitle "Each store incident shows owner, recovery pressure, and the next reopen-safe move." `
    -Bullets @(
        "Incident cases stay linked to guest and revenue impact.",
        "Operators see the next safe handoff.",
        "High-risk recovery drift surfaces early."
    )

New-ProofImage -Path (Join-Path $screenshots "03-sla-risks-proof.png") `
    -Title "SLA risks" `
    -Subtitle "Recovery proof, ETA drift, staffing mismatch, and dispatch parity stay tied to evidence." `
    -Bullets @(
        "Each blocker lists what evidence is still missing.",
        "Impact areas stay visible for prioritization.",
        "Restaurant recovery work stays mapped to a named owner."
    )

New-ProofImage -Path (Join-Path $screenshots "04-recovery-posture-proof.png") `
    -Title "Recovery posture" `
    -Subtitle "Recovery packets show confidence score, review window, and reopen-safe decision posture." `
    -Bullets @(
        "Red packets show immediate guest promise risk.",
        "Yellow packets preserve the next safe recovery cycle.",
        "Green packets stay governed without noise."
    )
