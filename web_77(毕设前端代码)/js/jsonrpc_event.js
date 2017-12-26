/*****************************************************************************/

var jsonrpcEventHandler;

/*****************************************************************************/

function JSONRpcEventHandler(jsonrpc, pollTimeMillis)
{
    if(jsonrpcEventHandler) return jsonrpcEventHandler;
    this.jsonrpc = jsonrpc;
    this.lastEvent = 0;
    this.listeners = new Array();
    this.pollTime = pollTimeMillis ? pollTimeMillis : 10000;
    this.timerId;
    jsonrpcEventHandler = this;
    return this;
}

/*****************************************************************************/

JSONRpcEventHandler.prototype.getEvents =
function JSONRpcEventHandler_getEvents()
{
    var events = this.jsonrpc.system.events(0);
    return events;
}

/*****************************************************************************/

JSONRpcEventHandler.prototype.addListener =
function JSONRpcEventHandler_addListener(l)
{
    for(var i = 0; i < this.listeners.length; ++i)
    {
        if(this.listeners[i] == l)
        {
            return;
        }
    }

    this.listeners.push(l);
    
    if(this.listeners.length == 1)
    {
        this.poll();
    }
}

/*****************************************************************************/

JSONRpcEventHandler.prototype.removeListener =
function JSONRpcEventHandler_removeListener(l)
{
    if(this.listeners.length == 0) return;

    for(var i = 0; i < this.listeners.length; ++i)
    {
        if(this.listeners[i] == l)
        {
            if(this.listeners.length > 1)
            {
                this.listeners[i] = this.listeners[this.listeners.length - 1];
            }
            this.listeners.pop();
            break;
        }
    }
}

/*****************************************************************************/

JSONRpcEventHandler.prototype.poll = 
function JSONRpcEventHandler_poll()
{
    if(this.listeners.length)
    {
        try
        {
            var events = this.jsonrpc.system.events(this.lastEvent);
            
            if(events && events.length > 0)
            {
                this.lastEvent = events[events.length - 1].id;
                
                for(var i = 0; i < this.listeners.length; ++i)
                {
                    var l = this.listeners[i];
                    if(l == null) continue;
                    l(events);
                }
            }
        }
        catch(exception)
        {
        }
        
        setTimeout("jsonrpcEventHandler.poll()", this.pollTime);
    }
}

/*****************************************************************************/
