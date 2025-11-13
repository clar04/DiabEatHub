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

        $ingredientsText = $this->extractIngredientsText($item);
        if ($ingredientsText) {
            $suspicious = ['sugar', 'glucose', 'fructose', 'syrup', 'corn syrup', 'maltose'];
            foreach ($suspicious as $word) {
                if (str_contains($ingredientsText, $word)) {
                    $notes .= ' Contains added sugar/sweetener (' . $word . ').';
                    break;
                }
            }
        }

        return array_merge($item, [
            'diabetes_flag' => $flag,
            'notes' => $notes,
        ]);
    }

    protected function extractIngredientsText(array $item): ?string
    {
        // kasus Open Food Facts: 'ingredients'
        if (!empty($item['ingredients']) && is_string($item['ingredients'])) {
            return strtolower($item['ingredients']);
        }

        // kasus Spoonacular DETAIL: 'extendedIngredients' (array)
        if (!empty($item['extendedIngredients']) && is_array($item['extendedIngredients'])) {
            return strtolower(json_encode($item['extendedIngredients']));
        }

        // kasus lain: nggak ada
        return null;
    }
}
