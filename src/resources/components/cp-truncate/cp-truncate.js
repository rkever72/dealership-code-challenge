import { bindable } from 'aurelia-framework';

export class CpTruncate {
    /*
    * Defines
    * */
    @bindable maxChars = 50;
    @bindable content = '';
    @bindable popoverContainer = 'body'; // where to dynamically add the DOM
    @bindable popoverPlacement; 'auto'; // auto, top, right, bottom, left

    _renderedContent = '';
    _refContentContainer;
    _truncated;


    /*
    * Lifecycle Methods
    * */
    bind() {
        this._renderedContent = this.truncate(this.content, this.maxChars);
    }

    attached() {
        if (this._truncated) {
            $(this._refContentContainer).popover({
                content: this.content,
                trigger: 'hover'
            });
        }
    }


    /*
    * ViewModel Methods
    * */
    truncate(content, maxChars) {
        if (!content) return false;
        if (!maxChars || content.length <= maxChars) return content;

        const maxFit = maxChars - 3;
        const truncateAt = (truncateAt === -1 || truncateAt < maxChars / 2) ? maxFit : content.lastIndexOf(' ', maxFit);

        this._truncated = true;

        // return truncated content
        return `${content.substr(0, truncateAt)}<span class="truncated color-primary--blue font-weight-bold ml-1" data-toggle="popover">&#8230;</span>`;
    }
}
