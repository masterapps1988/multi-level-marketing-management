class JsonResponse {
    constructor() {
        this.data = [];
        this.error = false;
        this.status = 200;
        this.message = null;
        this.validator = null;
        this.meta = [];
        this.traces = [];
    }

    setData(data)
    {
        this.data = data;
    }

    setMeta(data)
    {
        this.meta = data;
    }

    setError(error)
    {
        this.error = error;
    }

    setValidationException(e)
    {
        this.setError(true);
        this.validator = e.validator;
    }

    setMessage(message)
    {
        this.message = message;
    }

    setStatus(statusNo)
    {
        this.status = statusNo;
    }

    setTraces(traces)
    {
        this.traces = traces;
    }

    isError()
    {
        return this.error;
    }

    getResponse()
    {
        let errors = [];
        let message = this.message;

        // Check if validator is not empty
        if(this.validator) {
            let errors = this.validator.errors().all();
        }

        if(!message && errors)
            message = errors[0];
        else if((this.message))
            errors.push(this.message);

        // JSON reponse
        let resp = {
            'data' : this.data,
            '_meta' : this.meta,
            'is_error' : this.error,
            'errors' : errors,
            'status' : this.status,
            'message' : message,
            'trace' : this.traces
        };

        return resp;
    }

    getPaginatorConfig(paginator) {
        return {
            'current_page' : paginator.current_page,
            'last_page' : paginator.last_page,
            'per_page' : paginator.per_page
        };
    }
}

module.exports = JsonResponse;