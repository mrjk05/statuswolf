(function(){
    "use strict";

var initPackery = function() {
    var packeryContainer = $('#packery');

    packeryContainer.imagesLoaded(function() {
        packeryContainer.packery({
            itemSelector: ".status",
            stamp: "#menu-bar, #logotype",
            rowHeight: ".status",
            gutter: 15,
            //transitionDuration: 4000,
            isLayoutInstant: false
        });

        // TODO: Statuses should move as far to the left as they can after being
        //       dropped, rather than staying still
        // TODO: You shouldn't be able to drag expanded statuses

        // Make statuses draggable
        packeryContainer.find('.status').each(function(i, itemElem) {
            var draggie = new Draggabilly(itemElem);
            packeryContainer.packery('bindDraggabillyEvents', draggie);
        });
    });

    // Expand statuses when clicked
    packeryContainer.on('staticClick', function(event, pointer) {
        var clickedStatus = $(event.target).closest('.status');

        // Don't proceed if item wasn't clicked on
        if (clickedStatus.length === 0) {
            return;
        }

        // Shrink any currently expanded statuses
        $('.expanded-status').each(function() {
            // So we don't toggle twice when an expanded status is clicked
            if (this !== clickedStatus[0]) {
                // TODO: Statuses should go back where they were originally when you shrink them
                $(this).toggleClass('expanded-status');
            }
        });

        clickedStatus.toggleClass('expanded-status');

        if (!clickedStatus.hasClass('expanded-status')) {
            // Trigger layout when shrinking
            packeryContainer.packery();
        } else {
            packeryContainer.packery('fit', event.target);
        }
    });

    // TODO: Topmost statuses expand over the menu bar
    // TODO: Save layouts between sessions. See https://github.com/metafizzy/packery/issues/19
};

var fetchStatuses = function() {
    $.ajax({
        url: 'http://192.168.6.66:8086/todo',
        success: function(resp) {
            var pretendTemplate = 
                    "<div class='status'> \
                        <h3> \
                            {{statusName}} \
                        </h3> \
                        <span class='indicator traffic-light {{statusColour}}'> \
                            &#9679; <!-- BLACK CIRCLE: ● -- > \
                        </span> \
                    </div>",
                container = $("#packery");

            if (!resp.success) alert('Could not fetch statuses');

            resp.todos.forEach(function(cStatus) {
                var colour;

                switch (cStatus.status) {
                    case "1":
                        colour = "red";
                        break;
                    case "2":
                        colour = "yellow";
                        break;
                    case "3":
                    case undefined:
                        colour = "green";
                        break;
                }

                container.append(
                        pretendTemplate.replace("{{statusName}}", cStatus.title)
                            .replace("{{statusColour}}", colour));
            });
        }
    });
};

$(document).ready(function() {
    fetchStatuses();
    initPackery();
});

})();
