import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ElementRef} from "@angular/core";
import {IDropdownSettings} from "ng-multiselect-dropdown/multiselect.model";
import {AdditionalButton} from "../../domain_value/additional_button";
import set = Reflect.set;
import {Subscription} from "rxjs";
import {delay} from "rxjs/operators";

@Component({
    selector: "MultiSelect",
    templateUrl: "./multi_select.html",
    styleUrls: ["./multi_select.scss"]
})
export class MultiSelectComponent implements OnInit, OnDestroy {
    constructor() {}

    @ViewChild("child", {static: true, read: ElementRef}) elementRef: ElementRef;

    @Input()
    placeholder: string = 'Placeholder';

    dropdownListData = [];

    @Input()
    set dropdownList(list: Array<any>) {
        this.dropdownListData = list;
        setTimeout(() => this.addCollectionButton(), 1000);
    }

    @Input()
    enableCheckAll: boolean = false;
    @Input()
    allowSearchFilter: boolean = true;
    @Input()
    dropdownSettings: IDropdownSettings = {
        idField: 'id',
        textField: 'label',
        selectAllText: 'Select all',
        unSelectAllText: 'Deselect all',
        itemsShowLimit: 1,
    };

    additional_buttonData: Array<AdditionalButton> = [];
    @Input()
    set additional_button(buttons: Array<AdditionalButton>) {
        this.additional_buttonData = buttons;
        setTimeout(() => this.addCollectionButton(), 1000);
    }

    selectedItemsData: Array<any> = [];

    @Input()
    get selectedItems(): Array<any> {
        return this.selectedItemsData;
    }

    set selectedItems(items: Array<any>) {
        this.selectedItemsData = items;
        this.selectedItemsChange.emit(items);
        this.check_if_additional_buttons_are_selected();
    }

    @Output()
    items_changed_by_action: EventEmitter<void> = new EventEmitter();

    @Output()
    item_selected: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    item_deselected: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    select_all: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    deselect_all: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    selectedItemsChange: EventEmitter<Array<any>> = new EventEmitter();

    private additional_button_checkboxes: Map<number, any> = new Map();
    private subscription: Subscription = new Subscription();

    ngOnInit(): void {
        this.dropdownSettings.enableCheckAll = this.enableCheckAll;
        this.dropdownSettings.allowSearchFilter = this.allowSearchFilter;
        this.subscription.add(this.item_selected.subscribe(() => this.items_changed_by_action.next()));
        this.subscription.add(this.item_deselected.subscribe(() => this.items_changed_by_action.next()));
        this.subscription.add(this.select_all.pipe(delay(500)).subscribe(() => this.items_changed_by_action.next()));
        this.subscription.add(this.deselect_all.pipe(delay(500)).subscribe(() => this.items_changed_by_action.next()));
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    private addCollectionButton(): void {
        const root = this.elementRef.nativeElement.querySelector('.dropdown-list');
        
        // initially contains the select all and search nodes. 
        const collection_button_ul = root.querySelector('.item1')
       
        // an empty node that will contain the filter-textbox for searching
        // it will be appended before the segments checkboxes
        const ul_copy = collection_button_ul.cloneNode(false); 

        // selectable segments checkboxes
        const segments = root.querySelector('.item2')

        this.additional_button_checkboxes.clear();
        if (collection_button_ul.children.length > 1) {
            const select_all_checkbox = collection_button_ul.children[0];
            select_all_checkbox.style.padding = "6px 10px";
            select_all_checkbox.style.borderBottom = "none";
            const search_textbox = collection_button_ul.children[collection_button_ul.children.length - 1];
            collection_button_ul.innerHTML = "";

            collection_button_ul.appendChild(select_all_checkbox);
            for (const button of this.additional_buttonData) {
                const clone = select_all_checkbox.cloneNode(true);
                clone.children[1].innerHTML = button.label;
                clone.children[1].id = "additional_button" + button.id.toString();
                clone.children[0].checked = false;
                clone.addEventListener("click", () => {
                    clone.children[0].checked = !clone.children[0].checked;
                    this.selectedItems = button.list_selection_callback(button, this.selectedItemsData, this.dropdownListData, clone.children[0].checked);
                    this.items_changed_by_action.next();
                });
                this.additional_button_checkboxes.set(button.id, clone.children[0]);
                collection_button_ul.appendChild(clone);
            }
            collection_button_ul.children[collection_button_ul.children.length - 1].style.paddingBottom = "12px";
            if (search_textbox.className.includes("filter-textbox")) {
                search_textbox.style.borderBottom = "1px solid #ccc";
                search_textbox.style.borderTop = "1px solid #ccc";
                search_textbox.style.paddingBottom = "12px";
                ul_copy.appendChild(search_textbox);
                root.insertBefore(ul_copy, segments);
            }
            this.check_if_additional_buttons_are_selected();
        }
    }

    private check_if_additional_buttons_are_selected(): void {
        for (const button of this.additional_buttonData) {
            if (!this.additional_button_checkboxes.has(button.id))
                continue;

            const required_items = button.list_selection_callback(button, this.selectedItemsData, this.dropdownListData, true);
            const checked = required_items.every(item => this.selectedItemsData.find(r_item => r_item.id === item.id) !== undefined);
            this.additional_button_checkboxes.get(button.id).checked = checked;
        }
    }
}
