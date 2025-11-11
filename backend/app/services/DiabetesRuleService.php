<?php
namespace App\Services;

class DiabetesRuleService
{
    public function evaluate(array $item): array
    {
        $sugar = $item['sugar_g'] ?? 0;
        $carbs = $item['carbs_g'] ?? 0;

        $flag = 'OK';
        $notes = 'Suitable for diabetes with portion control.';

        if ($sugar > 10) {
            $flag = 'High Sugar';
            $notes = 'Sugar is high, consider alternative.';
        } elseif ($carbs > 25) {
            $flag = 'Watch Carbs';
            $notes = 'Carbohydrates are high, control portion.';
        }

        return array_merge($item, [
            'diabetes_flag' => $flag,
            'notes' => $notes,
        ]);
    }
}
