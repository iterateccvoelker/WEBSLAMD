from slamd.common.slamd_utils import float_if_not_empty, str_if_not_none
from slamd.materials.processing.models.powder import Powder, Composition, Structure
from slamd.materials.processing.strategies.base_material_strategy import BaseMaterialStrategy


class PowderStrategy(BaseMaterialStrategy):

    @classmethod
    def create_model(cls, submitted_material):
        composition = Composition(
            fe3_o2=float_if_not_empty(submitted_material['fe3_o2']),
            si_o2=float_if_not_empty(submitted_material['si_o2']),
            al2_o3=float_if_not_empty(submitted_material['al2_o3']),
            ca_o=float_if_not_empty(submitted_material['ca_o']),
            mg_o=float_if_not_empty(submitted_material['mg_o']),
            na2_o=float_if_not_empty(submitted_material['na2_o']),
            k2_o=float_if_not_empty(submitted_material['k2_o']),
            s_o3=float_if_not_empty(submitted_material['s_o3']),
            ti_o2=float_if_not_empty(submitted_material['ti_o2']),
            p2_o5=float_if_not_empty(submitted_material['p2_o5']),
            sr_o=float_if_not_empty(submitted_material['sr_o']),
            mn2_o3=float_if_not_empty(submitted_material['mn2_o3'])
        )

        structure = Structure(
            gravity=float_if_not_empty(submitted_material['gravity']),
            fine=float_if_not_empty(submitted_material['fine'])
        )

        return Powder(
            name=submitted_material['material_name'],
            type=submitted_material['material_type'],
            costs=cls.extract_cost_properties(submitted_material),
            composition=composition,
            structure=structure,
            additional_properties=cls.extract_additional_properties(submitted_material)
        )

    @classmethod
    def gather_composition_information(cls, powder):
        return [cls.include('Fe₂O₃', powder.composition.fe3_o2),
                cls.include('SiO₂', powder.composition.si_o2),
                cls.include('Al₂O₃', powder.composition.al2_o3),
                cls.include('CaO', powder.composition.ca_o),
                cls.include('MgO', powder.composition.mg_o),
                cls.include('Na₂O', powder.composition.na2_o),
                cls.include('K₂O', powder.composition.k2_o),
                cls.include('SO₃', powder.composition.s_o3),
                cls.include('TiO₂', powder.composition.ti_o2),
                cls.include('P₂O₅', powder.composition.p2_o5),
                cls.include('SrO', powder.composition.sr_o),
                cls.include('Mn₂O₃', powder.composition.mn2_o3),
                cls.include('Fine modules', powder.structure.fine),
                cls.include('Specific gravity', powder.structure.gravity)]

    @classmethod
    def convert_to_multidict(cls, powder):
        multidict = super().convert_to_multidict(powder)
        multidict.add('fe3_o2', str_if_not_none(powder.composition.fe3_o2))
        multidict.add('si_o2', str_if_not_none(powder.composition.si_o2))
        multidict.add('al2_o3', str_if_not_none(powder.composition.al2_o3))
        multidict.add('ca_o', str_if_not_none(powder.composition.ca_o))
        multidict.add('mg_o', str_if_not_none(powder.composition.mg_o))
        multidict.add('na2_o', str_if_not_none(powder.composition.na2_o))
        multidict.add('k2_o', str_if_not_none(powder.composition.k2_o))
        multidict.add('s_o3', str_if_not_none(powder.composition.s_o3))
        multidict.add('ti_o2', str_if_not_none(powder.composition.ti_o2))
        multidict.add('p2_o5', str_if_not_none(powder.composition.p2_o5))
        multidict.add('sr_o', str_if_not_none(powder.composition.sr_o))
        multidict.add('mn2_o3', str_if_not_none(powder.composition.mn2_o3))
        multidict.add('fine', str_if_not_none(powder.structure.fine))
        multidict.add('gravity', str_if_not_none(powder.structure.gravity))
        return multidict
