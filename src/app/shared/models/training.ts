import { TSShared } from './tsshared';

export class Training extends TSShared {
    id: number;
    uuid: string;
    training_category_option_id: number;
    training_sub_category_option_id: number; // added
    training_title_option_id: number;
    has_known_participants: number;
    training_start_date: string;
    training_end_date: string;
    training_length_value: number;
    training_length_interval: string;
    cpd: number;
    report_file: string;
    training_organizer_option_id: number;
    training_location_id: number;
    other_location_region: number;
    other_location: string;
    training_level_option_id: number;
    training_method_option_id: number;
    training_custom_1_option_id: number;
    training_custom_2_option_id: number;
    training_got_curriculum_option_id: number;
    training_primary_language_option_id: number;
    training_secondary_language_option_id: number;
    comments: string;
    got_comments: string;
    objectives: string;
    is_approved: number;
    is_tot: number;
    is_refresher: number;
    pre: number;
    post: number;
    modified_by: number;
    created_by: number;
    is_deleted: number;
    timestamp_updated: string; // Not Neccessary
    timestamp_created: string; // Not Neccessary
    is_completed: number;
    is_certified: number;

    bsrangevalue: any;
    mfl_name: string;
    training_location_type: number;
    participants: any[]; // List of participants
    trainers: any[];

    constructor(obj: any) {
        super();
        this.id = obj.id || 0;
        this.uuid = obj.uuid || null;
        this.training_category_option_id = obj.training_category_option_id || null;
        this.training_sub_category_option_id = obj.training_sub_category_option_id || null;
        this.training_title_option_id = obj.training_title_option_id || null;
        this.has_known_participants = obj.has_known_participants || 0;
        this.training_start_date = obj.training_start_date !== null ? this.prepareDate(obj.training_start_date) : null;
        this.training_end_date = obj.training_end_date !== null ? this.prepareDate(obj.training_end_date) : null;
        this.training_length_value = obj.training_length_value || null;
        this.training_length_interval = obj.training_length_interval || null;
        this.cpd = obj.cpd || null;
        this.report_file = obj.report_file || null;
        this.training_organizer_option_id = obj.training_organizer_option_id || null;
        this.training_location_id = obj.training_location_id || 0;
        this.other_location_region = obj.other_location_region || null;
        this.other_location = obj.other_location || null;
        this.training_level_option_id = obj.training_level_option_id || null;
        this.training_method_option_id = obj.training_method_option_id || null;
        this.training_custom_1_option_id = obj.training_custom_1_option_id || null;
        this.training_custom_2_option_id = obj.training_custom_2_option_id || null;
        this.training_got_curriculum_option_id = obj.training_got_curriculum_option_id || null;
        this.training_primary_language_option_id = obj.training_primary_language_option_id || null;
        this.training_secondary_language_option_id = obj.training_secondary_language_option_id || null;
        this.comments = obj.comments || null;
        this.got_comments = obj.got_comments || null;
        this.objectives = obj.objectives || null;
        this.is_approved = obj.is_approved || null;
        this.is_tot = obj.is_tot || null;
        this.is_refresher = obj.is_refresher || null;
        this.pre = obj.pre || null;
        this.post = obj.post || null;
        this.modified_by = obj.modified_by || null;
        this.created_by = obj.created_by || null;
        this.is_deleted = obj.is_deleted || null;
        this.timestamp_updated = obj.timestamp_created || null; // Not Neccessary
        this.timestamp_created = obj.timestamp_updated || null; // Not Neccessary
        this.is_completed = obj.is_completed || null;
        this.is_certified = obj.is_certified || null;

        this.bsrangevalue = this.createBsRangeValue();
        this.mfl_name = obj.mfl_name || null;
        this.training_location_type = obj.training_location_type || null;
        this.participants = obj.participants || [];
        this.trainers = obj.trainers || [];
    }

    createBsRangeValue() {
        if (this.training_start_date === null || this.training_end_date === null) {
            return null;
        }
        const start_date = new Date(this.training_start_date);
        const end_date = new Date(this.training_end_date);
        return [start_date, end_date];
    }

}
