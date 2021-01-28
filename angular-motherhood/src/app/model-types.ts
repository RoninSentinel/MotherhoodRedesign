export class AdminTokenModel {
    constructor(
        public id: number,
        public code: string,
        public access_level: string,
        public squadron_id: string,
        public is_active: number,  // Database stores boolean as tinyint.
    ) {}
}

export class AORModel {
    constructor(
        public name: string,
    ) {}
    
}

export class BlockCategoryModel {
    constructor(
        public id: number,
        public name: string,
        public short_name: string,
        public color: string,
        public is_active: number,  // Database stores boolean as tinyint.
        public squadron_id: string,
    ) {}

}

export class CrewMemberModel {
    constructor (
        public id: number,
        public rank: string,
        public last_name: string,
        public first_name: string,
        public middle_initial: string,
        public call_sign: string,
        public squadron_id: string,
        public flight_id: number,
        public crew_member_type_id: string,

        public flight?: FlightModel,
    ) {}

}

export class CrewMemberShiftLineTimeBlocksModel {
    constructor (
        public id: number,
        public crew_member_id: number,
        public shift_line_time_block_id: number,
        public position: number,

        public crew_member?: CrewMemberModel,

        // Cannot save a reference to the ShiftLineTimeBlock, due to circular json structure.
        public shift_line_time_block_position?: number,
        public line_template_color?: string,
        public line_template_name?: string,
    ) {}

}

export class CrewMemberTypeModel {
    constructor (
        public name: string,
    ) {}
    
}

export class FlightModel {
    constructor ( 
        public id: number,
        public name: string,
        public team_id: number,
        public squadron_id: string,

        public team?: TeamModel,
    ) {}
    
}

export class FlightOrdersModel {
    constructor (
        public id: number,
        public crew_member_id: number,
        public date: Date,
        public shift_template_instance_id: number,
        public total_hours_scheduled: number,

        public crew_member?: CrewMemberModel,
    ) {}

}

export class LineInstanceModel {
    constructor (
        public id: number,
        public line_template_id: number,
        public shift_template_instance_id: number,

        public line_template?: LineTemplateModel,
        public shift_line_time_blocks?: ShiftLineTimeBlockModel[],
        public shift_template_instance?: ShiftTemplateInstanceModel, // Not returned from API.
    ) {}

}

export class LineTemplateModel {
    constructor (
        public id: number,
        public name: string,
        public line_type_id: number,
        public color: string,
        public is_active: number,  // Database stores boolean as tinyint.
        public order_preference: number,
        public call_sign: string,
        public squadron_id: string,
        public aor_id: string,
        public is_hidden_in_read_mode: number,  // Database stores boolean as tinyint.
        public extra_field_name: string,
    ) {}

}

export class LineTypeModel {
    constructor (
        public name: string,
    ) {}
    
}

export class MotherhoodShiftScheduleModel {
    constructor (
        public shift_template: ShiftTemplateModel,
        public shift_template_instance: ShiftTemplateInstanceModel,
        public line_instances: LineInstanceModel[],
    ) {}
}

export class QualificationTypeModel {
    constructor (
        public id: number,
        public name: string,
        public crew_member_type_id: string,
    ) {}

}

export class QualificationsModel {
    constructor (
        public id: number, 
        public crew_member_id: number,
        public qualification_type_id: number,

        public qualification_type?: QualificationTypeModel,
    ) {}

}

export class ShiftLineTimeBlockModel {
    constructor (
        public id: number,
        public line_instance_id: number,
        public start_time: Date,
        public end_time: Date,
        public notes: string,
        public position: number,
        public mission_number: number,
        public block_category_id: number,

        public block_category?: BlockCategoryModel,
        public line_instance?: LineInstanceModel,
        public crew_member_shift_line_time_blocks?: CrewMemberShiftLineTimeBlocksModel[],
    ) {}

}

export class ShiftTemplateModel {
    constructor (
        public id: number,
        public name: string,
        public start_time: Date,  // May need to re-factor to only time.
        public end_time: Date,    // May need to re-factor to only time.
        public total_hours: number,
        public is_active: number,  // Database stores boolean as tinyint.
        public squadron_id: string,
    ) {}

}

export class ShiftTemplateInstanceModel {
    constructor (
        public id: number,
        public shift_template_id: number,
        public date: Date,

        public shift_template?: ShiftTemplateModel,
        public line_instances?: LineInstanceModel[],
    ) {}

}

export class SquadronModel {
    constructor (
        public name: string,
    ) {}

}

export class TeamModel {
    constructor ( 
        public id: number,
        public name: string,
        public squadron_id: string,
    ) {}
    
}