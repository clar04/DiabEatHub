<?php

namespace App\Services;

class DiabetesRuleService
{
    /**
     * Mengevaluasi item berdasarkan nutrisi dengan logic diabetes komprehensif.
     */
    public function evaluate(array $item): array
    {
        // 1. Normalisasi Data (Pastikan semua field ada & float)
        $calories = floatval($item['calories'] ?? 0);
        $carbs    = floatval($item['carbs_g'] ?? 0);
        $sugar    = floatval($item['sugar_g'] ?? 0);
        $fiber    = floatval($item['fiber_g'] ?? 0);
        $fat      = floatval($item['fat_g'] ?? 0);
        $satFat   = floatval($item['saturated_fat_g'] ?? 0);
        $sodium   = floatval($item['sodium_mg'] ?? 0);

        // Hindari division by zero untuk kalkulasi persentase
        $calories = $calories > 0 ? $calories : 1;

        $flags = [];
        $notes = [];
        $score = 0;

        // --- 2. Evaluasi Logic (Sistem Scoring) ---

        // A. Karbohidrat (per porsi)
        if ($carbs <= 45) {
            $flags[] = 'carb_ok';
            $score += 2;
        } elseif ($carbs <= 60) {
            $flags[] = 'carb_borderline';
            $notes[] = 'Karbohidrat agak tinggi (45-60g), perhatikan porsi.';
        } else {
            $flags[] = 'carb_high';
            $notes[] = 'Tinggi karbohidrat (>60g). Sebaiknya dikurangi.';
        }

        // B. Gula (Sugar)
        if ($sugar <= 5) {
            $flags[] = 'sugar_low';
            $score += 2;
        } elseif ($sugar <= 10) {
            $flags[] = 'sugar_moderate';
        } elseif ($sugar <= 20) {
            $flags[] = 'sugar_high';
            $notes[] = 'Gula cukup tinggi (>10g).';
        } else {
            $flags[] = 'sugar_very_high';
            $notes[] = 'Sangat tinggi gula (>20g)! Cari alternatif lain.';
        }

        // C. Serat (Fiber)
        if ($fiber >= 8) {
            $flags[] = 'fiber_very_good';
            $score += 2;
            $notes[] = 'Kaya serat, sangat bagus untuk kontrol gula darah.';
        } elseif ($fiber >= 5) {
            $flags[] = 'fiber_good';
            $score += 2; 
        } else {
            $flags[] = 'fiber_low';
            if ($carbs > 30) {
                $notes[] = 'Rendah serat tapi tinggi karbo (risiko lonjakan gula).';
            }
        }

        // D. Lemak Jenuh (Saturated Fat)
        // Batas aman: <10% total kalori
        $satFatPct = ($satFat * 9 / $calories) * 100;
        
        if ($satFatPct <= 10 && $satFat <= 4) {
            $flags[] = 'satfat_ok';
            $score += 1;
        } else {
            $flags[] = 'satfat_high';
            $notes[] = 'Tinggi lemak jenuh (>10% kalori), batasi konsumsi.';
        }

        // E. Sodium (Garam)
        if ($sodium <= 140) {
            $flags[] = 'sodium_low';
            $score += 1;
        } elseif ($sodium <= 400) {
            $flags[] = 'sodium_ok';
            $score += 1;
        } elseif ($sodium <= 700) {
            $flags[] = 'sodium_caution';
            $notes[] = 'Hati-hati, kandungan garam menengah.';
        } else {
            $flags[] = 'sodium_high';
            $notes[] = 'Tinggi garam (>700mg). Tidak disarankan untuk hipertensi.';
        }

        // --- 3. Tentukan Kategori Akhir ---
        
        $category = 'not_recommended'; // Default merah
        $badgeColor = 'red';
        $label = 'Kurang Ideal';

        if ($score >= 7) {
            $category = 'diabetes_friendly';
            $badgeColor = 'green';
            $label = 'Ramah Diabetes';
        } elseif ($score >= 4) {
            $category = 'can_be_adjusted';
            $badgeColor = 'yellow';
            $label = 'Boleh dengan Kontrol Porsi';
        }

        // Gabungkan hasil ke data asli dengan key baru 'analysis'
        return array_merge($item, [
            'analysis' => [
                'score' => $score,
                'category' => $category,
                'label' => $label,
                'badge_color' => $badgeColor,
                'flags' => $flags,
                'notes' => $notes,
                'disclaimer' => 'Informasi ini bukan saran medis. Konsultasikan dengan dokter/ahli gizi.'
            ]
        ]);
    }
}