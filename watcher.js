(function($){
	var events = {},
		destroy = function(type,selector,callback){
			//debugger;
			var funcList = events[type][selector],
				length = funcList.length;

			for(var i = 0; i < length; i ++)
			{
				if(callback == funcList[i])
				{
					funcList.splice(i,1);
				}
			}

			if(!funcList.length)
			{
				events[type][selector] = null;
			}
		},
		init = function(){
			var main = $(window),
				ev;

		inTypes:
			for(var type in events)
			{
				if(events.hasOwnProperty(type))
				{
					ev = events[type];
					if(ev)
					{
						for(var selector in ev)
						{
							if(ev.hasOwnProperty(selector) && ev[selector])
							{
								if(!ev.RUNNING)
								{
									ev.RUNNING = true;
									main.on(type,watcher);
								}
								continue inTypes;
							}
						}
						ev.RUNNING = false;
						main.off(type,watcher);
					}
					else
					{
						main.off(type,watcher);
					}
				}
			}
		},
		watcher = function(e){
			var $target = $(e.target),
				type = e.type,
				funcList = [],
				callbackList,
				callbackBufList,
				callbackLength,
				eventList;
			if(!events[e.type])
			{
				return false;
			}
			else
			{
				eventList = events[type];
				for(var key in eventList)
				{
					if(eventList.hasOwnProperty(key) && eventList[key])
					{
						if($target.is(key))
						{
							callbackList = eventList[key];
							callbackLength = callbackList.length;
							if(!callbackLength)
							{
								continue
							}
							else
							{
								if(callbackLength > 1)
								{
									for(var i = 0; i < callbackLength; i++)
									{
										funcList.push(callbackList[i]);
										//callbackList[i](e);
									}
								}
								else
								{
									//callbackList[0](e);
									funcList.push(callbackList[0]);
								}
							}
						}
					}
				}

				for(var i = 0; i < funcList.length; i++)
				{
					setTimeout(function(i){
						return function(){
							callbackList[i](e);
						}}(i),10);
				}
			}
		}

	$.fn.watch = function(type,callback,remove)
	{
		if( !events[type] )
		{
			events[type] = {RUNNING:false,COUNT:0};
		}

		if(!events[type][this.selector])
		{
			events[type][this.selector] = [];
		}

		if(!remove)
			events[type][this.selector].push(callback);
		else
			destroy(type,this.selector,callback);

		init();
		return this;
	}
})(jQuery)