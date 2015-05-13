define [
    "handlebars"
], (Handlebars) ->

    Handlebars.compile '
        <div class="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">{{ title }}</h4>
                    </div>
                    <div class="modal-body">
                        <p>{{{ body }}}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default confirmation">{{ confirmButtonLabel }}</button>
                        <button type="button" class="btn btn-primary refuse">{{ refuseButtonLabel }}</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->'