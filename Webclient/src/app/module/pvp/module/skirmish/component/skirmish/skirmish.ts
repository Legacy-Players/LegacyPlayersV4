import {Component, OnInit} from "@angular/core";
import {HeaderColumn} from "../../../../../../template/table/module/table_header/domain_value/header_column";
import {BodyColumn} from "../../../../../../template/table/module/table_body/domain_value/body_column";
import {DataService} from "../../../../../../service/data";
import {Localized} from "../../../../../../domain_value/localized";
import {InstanceMap} from "../../../../../../domain_value/instance_map";
import {AvailableServer} from "../../../../../../domain_value/available_server";
import {table_init_filter} from "../../../../../../template/table/utility/table_init_filter";
import {SkirmishSearchService} from "../../service/skirmish_search";
import {SettingsService} from "src/app/service/settings";
import {DateService} from "../../../../../../service/date";
import {TinyUrlService} from "../../../../../tiny_url/service/tiny_url";
import {Meta, Title} from "@angular/platform-browser";

@Component({
    selector: "Skirmish",
    templateUrl: "./skirmish.html",
    styleUrls: ["./skirmish.scss"],
    providers: [
        TinyUrlService
    ]
})
export class SkirmishComponent implements OnInit {

    header_columns: Array<HeaderColumn> = [
        {
            index: 0,
            filter_name: 'map_id',
            labelKey: "PvP.Skirmish.arena",
            type: 3,
            type_range: [{value: -1, label_key: "PvP.Skirmish.arena"}],
            col_type: 0
        },
        {
            index: 1,
            filter_name: 'server_id',
            labelKey: "PvP.Skirmish.server",
            type: 3,
            type_range: [{value: -1, label_key: "PvP.Skirmish.server"}],
            col_type: 0
        },
        {index: 2, filter_name: 'start_ts', labelKey: "PvP.Skirmish.start", type: 2, type_range: null, col_type: 2},
        {index: 3, filter_name: 'end_ts', labelKey: "PvP.Skirmish.end", type: 2, type_range: null, col_type: 2}
    ];
    body_columns: Array<Array<BodyColumn>> = [];
    clientSide: boolean = false;
    responsiveHeadColumns: Array<number> = [0, 1, 2];
    responsiveModeWidthInPx: number = 840;
    num_characters: number = 0;

    constructor(
        private dataService: DataService,
        private settingsService: SettingsService,
        private skirmishSearchService: SkirmishSearchService,
        public dateService: DateService,
        public tinyUrlService: TinyUrlService,
        private metaService: Meta,
        private titleService: Title
    ) {
        this.titleService.setTitle("LegacyPlayers - Skirmish search");
        this.metaService.updateTag({name: "description", content: "Search for skirmish arena logs submitted to Legacyplayers."});

        this.dataService.get_maps_by_type(1).subscribe((instance_maps: Array<Localized<InstanceMap>>) => {
            instance_maps.forEach(map => this.header_columns[0].type_range.push({
                value: map.base.id,
                label_key: map.localization
            }));
        });
        this.dataService.servers.subscribe((servers: Array<AvailableServer>) => {
            servers.forEach(server => this.header_columns[1].type_range.push({
                value: server.id,
                label_key: server.name + " (" + server.patch + ")"
            }));
        });
    }

    ngOnInit(): void {
        let filter;
        if (!this.settingsService.check("table_filter_skirmishes_search")) {
            filter = table_init_filter(this.header_columns);
            filter.end_ts.sorting = false;
            this.settingsService.set("table_filter_skirmishes_search", filter);
        } else {
            filter = this.settingsService.get("table_filter_skirmishes_search");
        }
        this.onFilter(filter);
    }

    onFilter(filter: any): void {
        this.skirmishSearchService.search_skirmishes(filter, (search_result) => {
            this.num_characters = search_result.num_items;
            this.body_columns = search_result.result.map(item => {
                const body_columns: Array<BodyColumn> = [];
                body_columns.push({
                    type: 3,
                    content: item.map_id.toString(),
                    args: {
                        icon: item.map_icon,
                        instance_meta_id: item.instance_meta_id
                    }
                });
                body_columns.push({
                    type: 3,
                    content: item.server_id.toString(),
                    args: null
                });
                body_columns.push({
                    type: 2,
                    content: item.start_ts.toFixed(0),
                    args: null
                });
                body_columns.push({
                    type: 2,
                    content: item.end_ts ? item.end_ts.toFixed(0) : '',
                    args: null
                });
                return {
                    color: '',
                    columns: body_columns
                };
            });
        }, () => {
        });
    }

}
