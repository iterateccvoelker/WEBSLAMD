from slamd.common.slamd_utils import string_to_number


class RatioParser:

    @classmethod
    def create_list_of_normalized_ratio_lists(cls, all_ratios, delimiter):
        return [cls._to_normalized_ratio_list(ratio, delimiter) for ratio in all_ratios]

    @classmethod
    def create_ratio_string(cls, entry):
        entry_list = list(entry)
        sum_of_independent_ratios = sum(entry_list)
        dependent_ratio_value = round(100 - sum_of_independent_ratios, 2)
        independent_ratio_values = cls.ratio_list_to_ratio_string(entry_list)
        all_ratios_for_entry = f'{independent_ratio_values}/{dependent_ratio_value}'
        return all_ratios_for_entry

    @classmethod
    def ratio_list_to_ratio_string(cls, ratio_list):
        rounded_entries = [str(round(entry, 2)) for entry in ratio_list]
        return '/'.join(rounded_entries)

    @classmethod
    def _to_normalized_ratio_list(cls, ratio, delimiter):
        pieces = ratio.split(delimiter)
        ratio_list = [string_to_number(piece) for piece in pieces]
        sum_ratio_list = sum(ratio_list)
        return [ratio / sum_ratio_list for ratio in ratio_list]

    @classmethod
    def weight_to_density_ratios(cls, normalized_ratios, base_materials):
        densities = [base_material['density'] for base_material in base_materials]
        normalized_density_ratios = []

        for normalized_ratio in normalized_ratios:
            weighted_ratios = [float(density) * float(ratio) for density, ratio in zip(densities, normalized_ratio)]
            sum_density_ratios = sum(weighted_ratios)

            normalized_density_ratio = [round(weighted / sum_density_ratios, 2) for weighted in weighted_ratios]
            normalized_density_ratios.append(normalized_density_ratio)

        return normalized_density_ratios



