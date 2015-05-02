(function(){
    "use strict";

var initPackery = function() {
    var packeryContainer = $('#packery'),
        opts = {
            itemSelector: ".status",
            //stamp: "#menu-bar, #logotype",
            rowHeight: ".status",
            gutter: 15,
            //transitionDuration: 4000,
            isLayoutInstant: false
        },
        mq = window.matchMedia("(handheld)"),
        isTouchDevice = ('ontouchstart' in document.documentElement) || mq.matches;

    packeryContainer.imagesLoaded(function() {
        packeryContainer.packery(opts);

        // TODO: Statuses should move as far to the left as they can after being
        //       dropped, rather than staying still
        // TODO: You shouldn't be able to drag expanded statuses

        // Make statuses draggable
        if (!isTouchDevice) {
            packeryContainer.find('.status').each(function(i, itemElem) {
                var draggie = new Draggabilly(itemElem);
                packeryContainer.packery('bindDraggabillyEvents', draggie);
            });
        }
    });

    // Expand statuses when clicked
    var expandStatuses = function(event, pointer) {
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

        if (!clickedStatus.hasClass('expanded-status') || isTouchDevice) {
            // Trigger layout when shrinking (and always on mobile)
            packeryContainer.packery();
        } else {
            // Trigger layout and fit when expanding
            packeryContainer.packery('fit', event.target);
        }
    };

    if (isTouchDevice) {
        packeryContainer.on('click', expandStatuses);
    } else {
        packeryContainer.on('staticClick', expandStatuses);
    }

    // Fix up spacing after you rotate your phone
    window.addEventListener('orientationchange', function() {
        // Make sure the rotation has happened before we trigger layout
        setTimeout(function() {
            packeryContainer.packery();
        }, 200);
    });

    // TODO: Save layouts between sessions. See https://github.com/metafizzy/packery/issues/19
};

var fetchStatuses = function() {
    $.ajax({
        url: 'http://192.168.6.66:8086/todo',
        success: function(resp) {
            var pretendTemplate = 
                    "<div class='status'> \
                        <div class='valign-wrapper'> \
                            <h3> \
                                {{statusName}} \
                            </h3> \
                        </div> \
                        <span class='indicator traffic-light {{statusColour}}'> \
                            &#9679; <!-- BLACK CIRCLE: ● -- > \
                        </span> \
                    </div>",
                container = $("#packery");

            if (!resp.success) alert('Could not fetch statuses');
            // TODO: Obviously we should handle this case eventually
            if (resp.todos.length === 0) alert('Not statuses returned');

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

            //initPackery();
        }
    });
};

var showRandomColourfulWolfOnHover = function() {
    var wolfLogo = $("#logotype");

    wolfLogo.on({
        mouseenter: function() {
            var positions = ["25%", "50%", "75%", "100%"],
                wolfIdx = Math.floor(Math.random() * positions.length);

            wolfLogo.css("background-position", positions[wolfIdx]);
        },
        mouseleave: function() {
            $("#logotype").css("background-position", "0");
        }
    });
};

var closeAddMenu = function() {
    var menuShadow = document.getElementsByName("menu-shadow")[0];
    if (menuShadow) menuShadow.style.visibility = "hidden";

    var addMenu = $('#add-menu')[0];
    var addMenuButton = $('#new-status')[0];
    addMenuButton.style.background = "none";
    addMenuButton.style.border = "1px solid White";
    addMenu.style.visibility = "hidden";
}

var initNewStatusForm = function() {
    $('#new-status').click(function() {
        var menuShadow = document.getElementsByName("menu-shadow")[0];
        if (menuShadow) menuShadow.style.visibility = "visible";

        var addMenu = $('#add-menu')[0];
        var addMenuButton = $('#new-status')[0];
        addMenuButton.style.backgroundColor = "#CC4040";
        addMenuButton.style.border = "1px solid #CC4040";
        addMenu.position = "fixed";
        addMenu.top = addMenuButton.offsetTop + addMenuButton.offsetHeight;
        addMenu.left = 0;
        addMenu.right = 0;
        addMenu.bottom = 0;
        addMenu.style.visibility = "visible";
    });

    $(document).on("click", function() {
        if(!$(event.target).closest('#add-menu, #new-status').length) {
            closeAddMenu();
        }
    });
};    

$(document).ready(function() {
    // Temp hack for testing
    $('.status').each(function() {
        $(this).html("<div class='valign-wrapper'>" + $(this).html() + "</div>");
    });

    //fetchStatuses();
    initPackery();
    showRandomColourfulWolfOnHover();
    initNewStatusForm();
});

})();
