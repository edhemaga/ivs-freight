import {sliceEvents} from '@fullcalendar/core';

export const CustomViewConfig = {

  classNames: ['custom-view'],

  content: (props) => {
    const segs = sliceEvents(props, true); // allDay=true
    const html =
      '<div class="view-title">' +
      props.dateProfile.currentRange.start.toUTCString() +
      '</div>' +
      '<div class="view-events">' +
      segs.length + ' events' +
      '</div>';

    return {html};
  }

};
