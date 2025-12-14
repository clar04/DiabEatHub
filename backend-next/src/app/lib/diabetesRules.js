// src/lib/diabetesRules.js

export function evaluateDiabetesRules(item) {
    // 1. Normalisasi Data
    // Di JS kita ambil value atau default 0, lalu convert ke Number
    const getVal = (val) => parseFloat(val) || 0;

    const nutrients = {
        calories: getVal(item.calories),
        carbs_g: getVal(item.carbs_g),
        sugar_g: getVal(item.sugar_g),
        fiber_g: getVal(item.fiber_g),
        fat_g: getVal(item.fat_g),
        saturated_fat_g: getVal(item.saturated_fat_g),
        sodium_mg: getVal(item.sodium_mg),
    };

    // Hindari pembagian dengan nol
    const calories = nutrients.calories > 0 ? nutrients.calories : 1;

    const flags = [];
    const notes = [];
    let score = 0;

    // --- 2. Evaluasi Logic (Sistem Scoring) ---

    // A. Karbohidrat
    if (nutrients.carbs_g <= 45) {
        flags.push('carb_ok');
        score += 2;
    } else if (nutrients.carbs_g <= 60) {
        flags.push('carb_borderline');
        notes.push('Karbohidrat agak tinggi (45-60g), perhatikan porsi.');
    } else {
        flags.push('carb_high');
        notes.push('Tinggi karbohidrat (>60g). Sebaiknya dikurangi.');
    }

    // B. Gula
    if (nutrients.sugar_g <= 5) {
        flags.push('sugar_low');
        score += 2;
    } else if (nutrients.sugar_g <= 10) {
        flags.push('sugar_moderate');
    } else if (nutrients.sugar_g <= 20) {
        flags.push('sugar_high');
        notes.push('Gula cukup tinggi (>10g).');
    } else {
        flags.push('sugar_very_high');
        notes.push('Sangat tinggi gula (>20g)! Cari alternatif lain.');
    }

    // C. Serat
    if (nutrients.fiber_g >= 8) {
        flags.push('fiber_very_good');
        score += 2;
        notes.push('Kaya serat, sangat bagus untuk kontrol gula darah.');
    } else if (nutrients.fiber_g >= 5) {
        flags.push('fiber_good');
        score += 2;
    } else {
        flags.push('fiber_low');
        if (nutrients.carbs_g > 30) {
            notes.push('Rendah serat tapi tinggi karbo (risiko lonjakan gula).');
        }
    }

    // D. Lemak Jenuh (<10% kalori)
    const satFatPct = (nutrients.saturated_fat_g * 9 / calories) * 100;

    if (satFatPct <= 10 && nutrients.saturated_fat_g <= 4) {
        flags.push('satfat_ok');
        score += 1;
    } else {
        flags.push('satfat_high');
        notes.push('Tinggi lemak jenuh (>10% kalori), batasi konsumsi.');
    }

    // E. Sodium
    if (nutrients.sodium_mg <= 140) {
        flags.push('sodium_low');
        score += 1;
    } else if (nutrients.sodium_mg <= 400) {
        flags.push('sodium_ok');
        score += 1;
    } else if (nutrients.sodium_mg <= 700) {
        flags.push('sodium_caution');
        notes.push('Hati-hati, kandungan garam menengah.');
    } else {
        flags.push('sodium_high');
        notes.push('Tinggi garam (>700mg). Tidak disarankan untuk hipertensi.');
    }

    // --- 3. Tentukan Kategori Akhir ---
    let category = 'not_recommended';
    let badgeColor = 'red';
    let label = 'Kurang Ideal';

    if (score >= 7) {
        category = 'diabetes_friendly';
        badgeColor = 'green';
        label = 'Ramah Diabetes';
    } else if (score >= 4) {
        category = 'can_be_adjusted';
        badgeColor = 'yellow';
        label = 'Boleh dengan Kontrol Porsi';
    }

    // Gabungkan hasil ke data asli
    return {
        ...item,
        analysis: {
            score,
            category,
            label,
            badge_color: badgeColor,
            flags,
            notes,
            disclaimer: 'Informasi ini bukan saran medis. Konsultasikan dengan dokter/ahli gizi.'
        }
    };
}