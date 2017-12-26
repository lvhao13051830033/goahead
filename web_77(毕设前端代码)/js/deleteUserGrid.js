/***********************
*字体是utf-8
************************/
DeleteUserGrid=function(jsonrpc, msg_grid, lang){

		var userData=[

		];
		
		var sm2 = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            // On selection change, set enabled state of the removeButton
            // which was placed into the GridPanel using the ref config
            selectionchange: function(sm) {
            }
        }
    });
    
    var reader = new Ext.data.ArrayReader({}, [
       {name: 'name'}
    ]);
		
	var store=new Ext.data.Store({
            reader: reader,
            data: userData
        });
	
	DeleteUserGrid.superclass.constructor.call(this,{
		    store:store,
        cm: new Ext.grid.ColumnModel([
            sm2,
            {id:'name',header: (lang==0)?"普通用户名":"Ordinary User Name",  sortable: true, width:300, dataIndex: 'name'}
        ]),
        sm: sm2,

        columnLines: true,

        // inline buttons
        buttons: [{
              text:(lang==0)?'删除':'Delete',
              handler:function (){
                 var selections=sm2.getSelections();
                 var user_names="{"+"\""+"number\":"+selections.length;
   
                 for(var i=0; i<selections.length; i++)
                 {
                    var record=selections[i];
                    user_names +=", \"name"+i+"\":\""+record.get('name')+"\"";
                 }
                 user_names +="}";
                 jsonrpc.user.setUserNames(user_names);

                 for (var j=0; j<selections.length; j++)
                 {  
                    store.remove(selections[j]);
                 }

                 msg_grid.addMsg(0,(lang==0)? "删除成功!":"Successfully delete user!");
             }
           },{
              text:(lang==0)?'刷新':'Refresh',
              handler:function (){
                store.removeAll();            
                var user_names=jsonrpc.user.getUserNames();
                for (var i=0; i<user_names.count; i++)
                {
                   store.add
                   (
                    new userRecord({name:user_names.names[i]})
                   );
                }
             }
           }],
        buttonAlign:'center',

        //width:320,
        height:200,
        Frame:true
		
		
	});
}

	
var userRecord=Ext.data.Record.create([
   {name:'name', mapping:'name', type:'string'}
]);
    
    
Ext.extend(DeleteUserGrid, Ext.grid.GridPanel,{
	addUser:function(new_name){
		this.getStore().add
    (
     new userRecord({name:new_name})
    )
	}
});
