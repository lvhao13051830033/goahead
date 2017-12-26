/*!
 * Ext JS Library 3.0.3
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.onReady(function(){
    var jsonrpc=new JSONRpcClient("/json-rpc");
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    Ext.BLANK_IMAGE_URL="images/default/s.gif";
    // NOTE: This is an example showing simple state management. During development,
    // it is generally best to disable state management as dynamically-generated ids
    // can change across page loads, leading to unpredictable results.  The developer
    // should ensure that stable state ids are set for stateful components in real apps.
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    function gridGetNames(grid){
       grid.getStore().removeAll();            
       var user_names=jsonrpc.user.getUserNames();
       for (var i=0; i<user_names.count; i++)
       {
          grid.getStore().add
          (
              new userRecord({name:user_names.names[i]})
          );
       }
    }


    var lang = jsonrpc.lang.getLangMode();
    var rate = jsonrpc.broadcast.getRate();
    var broadcast_paras = jsonrpc.broadcast.getParameters();
    var sfn = jsonrpc.device.getSfn();
    var device_params = jsonrpc.device.getParameters();
    var userMode = jsonrpc.user.getCurUser();
    var version=jsonrpc.about.getVersion();
    var stopOutput = jsonrpc.option.getStopOutput();
    var stopNullPkt = jsonrpc.option.getNullPkt();
    var broadcastMode = jsonrpc.option.getBroadcastMode();
    var trapParams = jsonrpc.trap.getTrapParams();
    var trapTotalEnable = jsonrpc.trap.getTrapEnable();
    var webversion = "V15.51.03";

    // create some portlet tools using built in Ext tool ids
    var tools = [{
        id:'close',
        handler: function(e, target, panel){
           panel.setVisible(false);
        }
    }];

    var messagegrid = new messageGrid(lang.flag);
    var delete_user_grid= new DeleteUserGrid(jsonrpc, messagegrid, lang.flag);
    gridGetNames(delete_user_grid);

function trueLen(str)
{
 return str.replace(/[^\x00-\xff]/g,"***").length;
}


function modify_user()
{
	 if (userMode.flag == 0)
	 {//普通用户
	 	var name=userMode.name;
	 } 
	 else
	 {//超级用户
	 	var name=Ext.getCmp("m_u_old_name").getValue();
	 }
   
   var new_name=Ext.getCmp("m_u_new_name").getValue();
   var new_pw=Ext.getCmp("m_u_new_pass").getValue();
   var confirm_pw=Ext.getCmp('m_u_new_pass_confirm').getValue();
   var invalid=0;
   if ((!name)||(trueLen(name)>10))
   {
    invalid=1;
    Ext.getCmp("m_u_old_name").markInvalid();
   }

   if ((!new_name)||((trueLen(new_name)>10)))
   {
    invalid=1;
    Ext.getCmp("m_u_new_name").markInvalid();
   }

   if ((!new_pw)||(trueLen(new_pw)>10))
   {
    invalid=1;
    Ext.getCmp("m_u_new_pass").markInvalid();
   }
 
   if ((!confirm_pw)||(trueLen(confirm_pw)>10))
   {
    invalid=1;
    Ext.getCmp('m_u_new_pass_confirm').markInvalid();
   }

   if (invalid==0)
   {//有效
      if (new_pw!=confirm_pw)
      {
       Ext.Msg.alert(((lang.flag)==0)?"警告":"Alarm", ((lang.flag)==0)?"密码与确认密码不一致!":"Password is not same as conformative password!");
      }
      else
      {
       var flag=jsonrpc.user.modifyUser({"oriName":name, "newName":new_name, "password":new_pw});
       if (flag.flag==-1)
       {
        Ext.Msg.alert(((lang.flag)==0)?"警告":"Alarm", ((lang.flag)==0)?"用户不存在!":"User does not exist!");
       }
       else if (flag.flag==-2)
       {
        Ext.Msg.alert(((lang.flag)==0)?"警告":"Alarm", ((lang.flag)==0)?"新用户名已存在!":"New user name hase already existed!");
       }
       else
       {
       	  if (name == userMode.name)
       	  {//当前用户名被修改了
       	  	userMode.name = new_name;
       	  	Ext.getCmp('current_user_label').setText((lang.flag==0)? '欢迎你:'+userMode.name :'Welcome:'+userMode.name);
       	  }
       	  
       	  if (userMode.flag==1)
       	  {//普通用户
       	  	gridGetNames(delete_user_grid);
       	  }

       	  Ext.getCmp("m_u_old_name").setValue("");
       	  Ext.getCmp("m_u_new_name").setValue("");
       	  Ext.getCmp("m_u_new_pass").setValue("");
       	  Ext.getCmp('m_u_new_pass_confirm').setValue("");
          messagegrid.addMsg(0,((lang.flag)==0)?"成功修改用户!":"Successfully modify user!");
       }
      }
   }
}

function add_user()
{
   var name=Ext.getCmp("add_u_name").getValue();
   var new_pw=Ext.getCmp("add_u_password").getValue();
   var confirm_pw=Ext.getCmp("add_u_confirm_pass").getValue();
   var invalid=0;
   if ((!name)||(trueLen(name)>10))
   {
    invalid=1;
    Ext.getCmp("add_u_name").markInvalid();
   }  

   if ((!new_pw)||(trueLen(new_pw)>10))
   {
    invalid=1;
Ext.getCmp("add_u_password").markInvalid();
   }
 
   if ((!confirm_pw)||(trueLen(confirm_pw)>10))
   {
    invalid=1;
Ext.getCmp('add_u_confirm_pass').markInvalid();
   }
   
   if (invalid==0)
   {
	if (new_pw != confirm_pw)
	{
	Ext.Msg.alert(((lang.flag)==0)?"警告":"Alarm", ((lang.flag)==0)?"密码与确认密码不一致!":"Password is not same as conformative password!");
	}
	else
	{
                Ext.getCmp("add_u_name").setValue("");
                Ext.getCmp("add_u_password").setValue("");
                Ext.getCmp("add_u_confirm_pass").setValue("");
		var flag=jsonrpc.user.addUser({"name":name, "password":new_pw});
		//alert(flag.flag);
		if (flag.flag==255)
		{//用户已满无法添加
		Ext.Msg.alert(((lang.flag)==0)?"警告":"Alarm", ((lang.flag)==0)?"用户已满无法添加!":"The user's capcity is overflow!");
		}
		else if(flag.flag==254)
		{//用户已存在
		Ext.Msg.alert(((lang.flag)==0)?"警告":"Alarm", ((lang.flag)==0)?"用户已存在!":"The user has already existed!");
		}
		else 
		{//正常添加
      delete_user_grid.addUser(name);
      messagegrid.addMsg(0,((lang.flag)==0)?"成功添加用户!":"Successfully add user!");
		}
	}
 }
}

function form_submit()
{
   if((Ext.getCmp('deviceIP').isValid())&&(Ext.getCmp('deviceMask').isValid())&&(Ext.getCmp('deviceGateWay').isValid()))
        {
		jsonrpc.sys.setparams({"ipaddr":Ext.getCmp('deviceIP').getValue(), "netmask":Ext.getCmp('deviceMask').getValue(),"gateway":Ext.getCmp('deviceGateWay').getValue()});
		messagegrid.addMsg(0,((lang.flag)==0)?"成功修改设备参数!":"Successfully modify device parameters!");
		window.location="http://"+Ext.getCmp('deviceIP').getValue()+"/home.html";
        } 
}

function setRate()
{
   var codeRate=Ext.getCmp('code_rate').getValue();
   var res=jsonrpc.broadcast.setRate({"rate":codeRate});
   if (res.flag==0)
   {
   	 messagegrid.addMsg(0,((lang.flag)==0)?"成功修改输出码率":"Successfully modify output code rate!");
   }
}

function setBroadcastParams()
{
   if((Ext.getCmp('IP_addr').isValid())&&(Ext.getCmp('port').isValid()))
        {
		   var broad_IP=Ext.getCmp('IP_addr').getValue();
			var broad_port=Ext.getCmp('port').getValue();
			var res = jsonrpc.broadcast.setParameters({"multiIP":broad_IP,"multiPort":broad_port});
			if (res.flag==0)
			{
				messagegrid.addMsg(0,((lang.flag)==0)?"成功修改播放地址":"Successfully modify broadcast address!");
			}
			else
		        {
			  messagegrid.addMsg(1,((lang.flag)==0)?"播放地址参数错误":"Broadcast address error!");
			}
        } 
}

		function setRTPBroadcastParams()
		{
   			if((Ext.getCmp('RTPIP_addr').isValid())&&(Ext.getCmp('RTP_port').isValid()))
        {
					  var RTPbroad_IP=Ext.getCmp('RTPIP_addr').getValue();
						var RTPbroad_port=Ext.getCmp('RTP_port').getValue();
						var res = jsonrpc.broadcast.setRTPParameters({"RTPIP":RTPbroad_IP,"RTPPort":RTPbroad_port});
						if (res.flag==0)
						{
								messagegrid.addMsg(0,((lang.flag)==0)?"成功修改RTP播放地址":"Successfully modify RTP broadcast address!");
						}
						else
					  {
						 	 	messagegrid.addMsg(1,((lang.flag)==0)?"RTP播放地址参数错误":"RTP Broadcast address error!");
						}
        }
		}

    function showUser() 
    {
      Ext.getCmp('User_Settings').setVisible(true);
    }

    function showBroadcast()
    {
       Ext.getCmp('Broadcast_Settings').setVisible(true);
    }

    function showDevice()
    {
       Ext.getCmp('Device_Settings').setVisible(true);
    }
    
    function fileSet()
    {
       Ext.getCmp('sys_down').setVisible(true);
    }

    function optionSet()
    {
      Ext.getCmp('option_Settings').setVisible(true);
    }
    
    function trapSet()
    {
      Ext.getCmp('Trap_Settings').setVisible(true);
    }

    function showAbout() 
    {
       Ext.getCmp('About_Settings').setVisible(true);
    }

    function showMessage() 
    {
    	
       Ext.getCmp('Message_Settings').setVisible(true);
    }

    function showRestart() 
    {
       Ext.MessageBox.confirm(((lang.flag)==1)?"Option Dialog":"选择对话框",((lang.flag)==1)?"Do you really want to restart the device?":"你真的要重启设备吗?",function(btn){if (btn=="yes"){jsonrpc.sys.reboot()}});
    }

   function setTrapParams()
   {
   	  var tEnable = 0;
   	  if(totalEnabelCheckBox.getValue())
   	  {
   	  	tEnable = 1;
   	  }
   	  else
   	  {
   	  	tEnable = 0;
   	  } 

   	  
   	  if (intervalField.isValid())
   	  {
   	  	jsonrpc.trap.setTrapParams({"totalEnable":tEnable,"time":intervalField.getValue(),"count":4,"operation":0,
   	  	"traps":[{
   	  		"enable":(Ext.getCmp('trapV1_enable_id').getValue()? 1:0),
   	  		"type":(Ext.getCmp('trap_version1_V2c').getValue()? 1:0),
   	  		"ip":Ext.getCmp('trapV1_ip_id').getValue(),
   	  		"port":Ext.getCmp('trapV1_port_id').getValue()
   	  	},{
   	  		"enable":(Ext.getCmp('trapV2_enable_id').getValue()?1:0),
   	  		"type":(Ext.getCmp('trap_version2_V2c').getValue()? 1:0),
   	  		"ip":Ext.getCmp('trapV2_ip_id').getValue(),
   	  		"port":Ext.getCmp('trapV2_port_id').getValue()
   	  	},{
   	  		"enable":(Ext.getCmp('trapInform1_enable_id').getValue()? 1:0),
   	  		"type":0,
   	  		"ip":Ext.getCmp('trapInform1_ip_id').getValue(),
   	  		"port":Ext.getCmp('trapInform1_port_id').getValue()
   	  	},{
   	  		"enable":(Ext.getCmp('trapInform2_enable_id').getValue()? 1:0),
   	  		"type":0,
   	  		"ip":Ext.getCmp('trapInform2_ip_id').getValue(),
   	  		"port":Ext.getCmp('trapInform2_port_id').getValue()
   	  	}]});
   	  }}

   var totalEnabelLabel = new Ext.form.Label({
   	text:(lang.flag==0)?'总体使能:':'TotalEnable:'
   });
   
   var totalEnabelCheckBox = new Ext.form.Checkbox({
   	 checked:(trapTotalEnable.trapEnable==0)? false:true
   });
   
   var intervalLabel = new Ext.form.Label({
   	text:(lang.flag==0)?'trap 间隔(1-999秒):':'trap interval(1s-999s):'
   });
   
   var intervalField = new Ext.form.TextField({
   	width:100,
   	value:trapTotalEnable.time+"",
   	msgTarget:'side',
    regex : /^[1-9]\d{0,2}$/,
    allowBlank:false,
 	  regexText : (lang.flag==0) ? '输入非法' : 'Invalid Input'
   });

   var trapVer1TypeGroup = new Ext.form.RadioGroup({
		id: 'trap_version1',
		name: 'trap_version1',
		width:150,
		height:25,
		fieldLabel: ((lang&1)==0)? "Trap1版本": "Trap1 version",
		items: [{
			id: 'trap_version1_V1',
			boxLabel: 'V1',
			name: 'trap_version1', 		//group
			inputValue: 1,
			checked: (trapParams.traps[0].type==0)? true:false,
			style : 'margin-left:30%'
		},{
			id: 'trap_version1_V2c',
			boxLabel: 'V2c',
			name: 'trap_version1',
			inputValue: 2,
			checked: (trapParams.traps[0].type==1)? true:false
		}]
  });

  var trapVer2TypeGroup = new Ext.form.RadioGroup({
		id: 'trap_version2',
		name: 'trap_version2',
		width:150,
		height:25,
		fieldLabel: ((lang & 1) == 0)? "Trap2版本": "Trap2 version",
		items: [{
			id: 'trap_version2_V1',
			boxLabel: 'V1',
			name: 'trap_version2', 		//group
			inputValue: 1,
			checked: (trapParams.traps[1].type==0)? true:false,
			style : 'margin-left:30%'
		},{
			id: 'trap_version2_V2c',
			boxLabel: 'V2c',
			name: 'trap_version2',
			inputValue: 2,
			checked: (trapParams.traps[1].type==1)? true:false
		}]
	});

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[{
			//405到465是布局中的north，显示欢迎信息
             region:'north',
            id:'north-panel',
            //split:true,
            height: 75,
            margins:'8 8 0 8',
            items:[{
             //border:false,
             height:50,
             layout:'column',
             layoutConfig:{
               columns:4
              },items: [{
               columnWidth:.2,
               border:false,
               html:'<img src="images/logo1.gif" />'
               },{
               columnWidth:.3,
               border:false,
               xtype:'label',
               text:'IR600',
               style:'font:40 Arail bold; paddingLeft:60; margin-top:1'
               },{
               columnWidth:.5,
               border:false,
               items:[{
                 layout:'column',
                 border:false,
                 layoutConfig:{
                   columns:3
                     },
                   items:[{
                   columnWidth:.30,
                   border:false,
                   xtype:'label',
                   text:(lang.flag==0)? '软件版本:'+version.mv : 'Software:'+version.mv,
                   style:'font:16 bolder; margin-top:20'
                     },{
                   columnWidth:.30,
                   border:false,
                   xtype:'label',
                   text:(lang.flag==0)? '网管版本:'+webversion : 'Hardware:'+webversion,
                   style:'font:16 bolder; paddingLeft:10px;margin-top:20'
                     },{
                   columnWidth:.20,
                   border:false,
                   xtype:'label',
                   text:(lang.flag==0)? '硬件版本:'+version.mc : 'Hardware:'+version.mc,
                   style:'font:16 bolder; paddingLeft:10px;margin-top:20'
                     },{
                   id:'current_user_label',
                   columnWidth:.20,
                   border:false,
                   xtype:'label',
                   text:(lang.flag==0)? '欢迎你:'+userMode.name :'Welcome:'+userMode.name ,
                   style:'font:16 bolder;margin-top:20'
                    }]
                  }]
                }]
              }]
        },{
			//
            xtype:'portal',
            region:'center',
            margins:'0 8 0 8',
			items:[
				//最大的tab面板
			new Ext.TabPanel({
				id: 'cardpanel',
	    		activeTab: 0,
			//接下来的工作就是向这个tabpanel里添加items
				items:[{
					columnWidth:1,
					style:'padding:10px 0 10px 12017/11/270px',
                   title: (lang.flag==0)? "用户设置":"UserSettings",
                   id:'User_Settings',
                   tools: tools,
                   height:260,
                   items:[
                    new Ext.TabPanel({
                    	activeItem:0,
                    	width:402,
                    	height:230,
                    	id:'userTablePanel_id',
                   	  items:[{
                   	  	autoHeight:true,
                        xtype:'form',
                        defaultType:'textfield',
                        id:'m_user_panel',
                        bodyStyle:'text-align:center;',
                        title:(lang.flag==0)? "修改用户":"UserModification",
                        items:[{                       
                             id:'m_u_old_name',
                             hidden:(userMode.flag==0)?true:false,
                             fieldLabel:(userMode.flag==0)? "":(((lang.flag)==0)?"原用户名(<10个字符,<4个汉字)":"Old Name(<10 chars)"),
                             name:'m_u_old_name',
                             style:'margin-top:1px',
                             msgTarget:'side'
                           },{
                             id:'m_u_new_name',
                             fieldLabel:((lang.flag)==0)?"新用户名(<10个字符,<4个汉字)":"New Name(<10 chars)",
                             name:'new_name',
                             msgTarget:'side'
                           },{
                             id:'m_u_new_pass', 
                             inputType:'password',
                             fieldLabel:((lang.flag)==0)?"新密码(<10个字符,<4个汉字)":"New Password(<10 chars)",
                             name:'m_u_new_pass',
                             msgTarget:'side'
                           },{
                             id:'m_u_new_pass_confirm',
                             inputType:'password',
                             fieldLabel:((lang.flag)==0)?"确认密码(<10个字符,<4个汉字)":"Confirm Password(<10 chars)",
                             name:'m_u_new_pass_confirm',
                             msgTarget:'side'
                           },{
                             id:'m_u_btn',
                             xtype:'button',
                             text:((lang.flag)==0)?"确认":"submit",
                             width:100,
                             height:25,
                             handler:modify_user
                        }]
                      },{
                       xtype:'form',
                       bodyStyle:'text-align:center;',
                       id:'add_u_panel',
                       title:((lang.flag)==0)?"添加用户":"Add User",
                       defaultType:'textfield',
                       items:[{
                          id:'add_u_name',
                          fieldLabel:((lang.flag)==0)?"用户名(<10个字符,<4个汉字)":"User Name(<10 chars)",
                          name:'add_u_name',
                          style:'margin-top:1px; margin-bottom:2px',
                          msgTarget:'side'
                       },{
                          id:'add_u_password',
                          inputType:'password',
                          fieldLabel:((lang.flag)==0)?"密码(<10个字符,<4个汉字)":"Password(<10 chars)",
                          name:'add_u_password',
                          style:'margin-bottom:12px',
                          msgTarget:'side'
                       },{
                          id:'add_u_confirm_pass',
                          inputType:'password',
                          fieldLabel:((lang.flag)==0)?"确认密码(<10个字符,<4个汉字)":"Confirm Password(<10 chars)",
                          name:'add_u_confirm_pass',
                          style:'margin-bottom:54px',
                          msgTarget:'side'
                       },{
                          id:'m_u_btn',
                          xtype:'button',
                          text:((lang.flag)==0)?"确认":"submit",
                          width:100,
                          height:25,
                          handler:add_user
                       }]
                      },{
                         title: (lang.flag==0)? '用户列表':'User List',
                         height:230,
                         id:'userListPanel',
                         items: delete_user_grid
                      }]
                    })]
                  },{
                	 title: (lang.flag==0)? '日志信息':'Message Settings',
                    layout:'fit',
                    id:'Message_Settings',
                    tools: tools,
                    items: messagegrid
                 },{
                   title: (lang.flag==0)? '关于信息':'About Settings',
                   height:260,
                   id:'About_Settings',
                   tools: tools,
                   layout:'form',
                   items:[{
                    bodyStyle:'text-align:center;paddingLeft:18%;',
                    xtype:'label',
                    html:(lang.flag==0)? '<div id="serverTime" style="margin:10px; font-size:18px ">电话:86-010-62227604<br/><br/>传真:86-01062227125<br/><br/>网址:<a href="http://www.circloop.com.cn" target="_blank">www.circloop.com.cn<a/><br/><br/>电子邮件:<a href="mailto:circloop@vip.163.com">circloop@vip.163.com</a><br/><br/>电子邮件:<a href="mailto:sales@circloop.com.cn">sales@circloop.com.cn</a></div>' : '<div style="margin:10px; font-size:18px ">Tel:86-010-62227604<br/><br/>Fax:86-01062227125<br/><br/>Website:<a href="http://www.circloop.com.cn" target="_blank">www.circloop.com.cn<a/><br/><br/>E-mail:<a href="mailto:circloop@vip.163.com">circloop@vip.163.com</a><br/><br/>E-mail:<a href="mailto:sales@circloop.com.cn">sales@circloop.com.cn</a></div>'
                   }]
                },{
                   title: (lang.flag==0)?'设备设置':'Device Settings',
                   id:'Device_Settings',
                   tools: tools,
                   height:260,
                   layout:'form',
                   labelAilgn:'right',
                   items:[{
                    xtype:'fieldset',
                    bodyStyle:'text-align:center;paddingLeft:18%;',
                    title:(lang.flag==0)?'单频网设置':'SFN Config',
                    items:[{
                    	   fieldLabel:(lang.flag==0)?'单频网模式':'SFN mode',
                         xtype:'checkbox',
                         checked:(sfn.sfn==0)? false:true,
                         handler:function()
                         {
                            if (this.getValue())
                            {
                            	 jsonrpc.device.setSfn({sfn:1});
                            }	
                            else
                            {
                               jsonrpc.device.setSfn({sfn:0});
                            }
                            
                            messagegrid.addMsg(0,((lang.flag)==0)?"成功修改单频网!":"Successfully modify sfn!");
                         }
                       }]
                    },{
								style:'padding:10px 10px 10px 10px',
			                    xtype:'form',
			                    id:'params_form',
			                    border:true,
			                    //bodyStyle:'text-align:center;paddingLeft:18%;border:1px solid #b5b8c8; paddingTop:10px; paddingBottom:10px;',
			                    title:(lang.flag==0)?'网络参数':'Net Patameters',
			                    items:[{
			                        id:"deviceIP",
			                        fieldLabel:(lang.flag==0)?'IP地址':'IP Addr', 
			                        name:'ip_addr',
			                        xtype:'textfield',
			                        allowBlank:false,
			                        style:'margin-bottom:1%;',
			                        value:device_params.IPaddr,
											        regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
					                    regexText : (lang.flag==0) ? 'IP输入非法' : 'Invalid IP',
			                        listeners:{
			                         specialkey : function(field, e){
																 if(e.getKey() == Ext.EventObject.ENTER){
																		 getCmp('deviceIP').focus(true,true);
																 } 
											         }
										         }
                       },{
			                        id:"deviceMask",
			                        fieldLabel:(lang.flag==0)?'掩码':'NetMask', 
			                        name:'netmask',
			                        xtype:'textfield',
			                        allowBlank:false,
			                        style:'margin-bottom:1%;',
			                        value:device_params.netmask,
			                        regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
						                  regexText : (lang.flag==0) ? '掩码输入非法' : 'Invalid netmask',
				                      listeners:{
			                         specialkey : function(field, e){
																 if(e.getKey() == Ext.EventObject.ENTER){
																		 getCmp('deviceMask').focus(true,true);
																 } 
											         }
										         }
                       },{
	                        	id:"deviceGateWay",
		                        fieldLabel:(lang.flag==0)?'网关':'GateWay', 
		                        name:'gateway',
		                        xtype:'textfield',
		                        allowBlank:false,
		                        style:'margin-bottom:1%;',
		                        value:device_params.gateway,
														regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
				                  	regexText : (lang.flag==0) ? '网关输入非法' : 'Invalid gateway',
		                        listeners:{
			                         specialkey : function(field, e){
																 if(e.getKey() == Ext.EventObject.ENTER){
																		 getCmp('deviceGateWay').focus(true,true);
																 } 
											         }
										        }
                       },{
                        xtype:'button',
                        width:100,
                        height:10,
                        //style:'margin-left:25%;',
                        text:(lang.flag==0)?'确认':'Confirm',
                        handler:form_submit
                       }]
                    },//设备参数中的网络参数结束
						{
                   title: (lang.flag==0)?'播放设置':'Broadcast Settings',
                   id:'Broadcast_Settings',
                   tools: tools,
                   height:400,
                   layout:'form',
                   items:[{
                    xtype:'fieldset',
                    bodyStyle:'text-align:center;paddingLeft:18%;',
                    title:(lang.flag==0)?'输出码速率':'Output Code Rate',
                    items:[{
                    	  id:'code_rate',
                        fieldLabel:(lang.flag==0)?'码速率(1000-108000Kbps)':'CodeRate(1000-108000Kbps)',
                        xtype:'textfield',
                        style:'margin-bottom:5%;',
                        value:rate.rate
                       },{
                        xtype:'button',
                        width:100,
                        height:10,
                        //style:'margin-left:25%;',
                        text:(lang.flag==0)?'确认':'Confirm',
                        handler:setRate
                       }]
                   },{
                    xtype:'fieldset',
                    //bodyStyle:'text-align:center;paddingLeft:18%;',
                    title:(lang.flag==0)?'播放参数':'Broadcast Parameters',
                    items:[{
						            xtype: 'radiogroup',
						            id:'radio_group_id',
						            fieldLabel: (lang.flag==0)?'协议模式':'Protocol:',
						            width:200,
						            height:20,
						            border:false,
						            items: [
						                {boxLabel: 'UDP', name: 'pro_mode', inputValue: 1,checked: (broadcast_paras.mode==1? true:false)},
						                {boxLabel: 'RTP', name: 'pro_mode', inputValue: 2,checked: (broadcast_paras.mode==2? true:false)}
						            ],
								        listeners:{
								        	change:function(){
								        		var selectValue = this.getValue().inputValue;
								        		var res = jsonrpc.broadcast.setProtocol({mode:selectValue});
								        		if (selectValue==1)
								        		{//UDP
								        			Ext.getCmp('protocol_tabpanel').setActiveTab('UDP_tabpanel');
								        		}
								        		else if (selectValue==2)
								        		{//RTP
								        			Ext.getCmp('protocol_tabpanel').setActiveTab('RTP_tabpanel');
								        		}
								        	}
								        }   
								    },
                    new Ext.TabPanel({
                    	activeItem:(broadcast_paras.mode==1? 0:1),
                    	width:375,
                    	height:200,
                    	id:'protocol_tabpanel',
                   	  items:[{
                   	  	autoHeight:true,
                        xtype:'form',
                        defaultType:'textfield',
                        id:'UDP_tabpanel',
                        bodyStyle:'text-align:center; paddingLeft:18%; paddingTop:15px; paddingBottom:10px;',
                        title:(lang.flag==0)? "UDP模式":"UDP Mode",
                        items:[{
		                         xtype:'textfield',
		                         id:'IP_addr',
		                         allowBlank:false,
		                         style:'margin-bottom:5%;',
		                         fieldLabel:(lang.flag==0)?'IP地址':'IP Addr',
		                         value:broadcast_paras.IP,
										         regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		                         regexText : (lang.flag==0) ? 'UDP IP输入非法' : 'Invalid UDP IP',
                             listeners:{
			                         specialkey : function(field, e){
													       if(e.getKey() == Ext.EventObject.ENTER){
														        getCmp('IP_addr').focus(true,true);
													       }
											         }
										         }
		                    },{
		                         xtype:'textfield',
		                         id:'port',
		                         allowBlank:false,
		                         style:'margin-bottom:5%;',
		                         fieldLabel:(lang.flag==0)?'端口':'Port',
		                         value:broadcast_paras.Port,
									    			 regex :/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
                             regexText : (lang.flag==0) ? 'UDP 端口输入非法' : 'Invalid UDP Port',
                             listeners:{
			                         specialkey : function(field, e){
																 if(e.getKey() == Ext.EventObject.ENTER){
																	 getCmp('port').focus(true,true);
																 } 
											         }
										         }
		                    },{
		                         xtype:'button',
		                         width:100,
		                         height:10,
		                         text:(lang.flag==0)?'确认':'Confirm',
		                         handler:setBroadcastParams
		                    }]
                      },{
                       xtype:'form',
                       bodyStyle:'text-align:center;',
                       id:'RTP_tabpanel',
                       //labelWidth:180,
                       bodyStyle:'text-align:center; paddingLeft:18%; paddingTop:15px; paddingBottom:10px;',
                       title:((lang.flag)==0)?"RTP模式":"RTP Mode",
                       items:[{
		                         xtype:'textfield',
		                         id:'RTPIP_addr',
		                         allowBlank:false,
		                         style:'margin-bottom:5%;',
		                         fieldLabel:(lang.flag==0)?'IP地址':'IP Addr',
		                         value:broadcast_paras.RTPIP,
									           regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		                         regexText : (lang.flag==0) ? 'RTP IP输入非法' : 'Invalid RTP IP',
                             listeners:{
			                         specialkey : function(field, e){
																 if(e.getKey() == Ext.EventObject.ENTER){
																		 getCmp('RTPIP_addr').focus(true,true);
																 } 
											         }
										         }
		                    },{
		                         xtype:'textfield',
		                         id:'RTP_port',
		                         allowBlank:false,
		                         style:'margin-bottom:5%;',
		                         fieldLabel:(lang.flag==0)?'端口':'Port',
		                         value:broadcast_paras.RTPPort,
										         regex :/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
                             regexText : (lang.flag==0) ? 'RTP 端口输入非法' : 'Invalid RTP Port',
                             listeners:{
		                            specialkey : function(field, e){
																	if(e.getKey() == Ext.EventObject.ENTER){
																		getCmp('RTP_port').focus(true,true);
																	}
																}
														}
		                    },{
		                         xtype:'button',
		                         width:100,
		                         height:10,
		                         text:(lang.flag==0)?'确认':'Confirm',
		                         handler:setRTPBroadcastParams
		                    }]
                      }]
                    })]
                  }]
                },//到这里第设备参数里的播放参数结束
					   {
					   title: (lang.flag==0)?'下载设置':'Download',
									id: 'sys_down',
									tools: tools,
									bodyStyle:'paddingTop:5%;paddingLeft:5%;',
							    height: 240,
									labelAlign: 'left',
									items: [{
										xtype:'label',
										html:(lang.flag==0)?'<div>MIB下载 (右键点击另存目标)</div><br/>':'<div>MIB download (Right click and select saveAs)</div><br/>'
									},{
										xtype:'label',
										html:"<div><a href='ftp://target:target@"+device_params.IPaddr+"/mnt/mtd/mibs/IR600.mib'>IR600.mib</a></div><br/>"
									}]
					   },//到这里是设备参数里的下载设置结束
									{
									title: (lang.flag==0)? '选项设置':'Options Settings',
                   height:260,
                   id:'option_Settings',
                   tools: tools,
                   layout:'form',
                   items:[{
	                        xtype:'fieldset',
		                      bodyStyle:'text-align:center;paddingLeft:18%;',
		                      title:(lang.flag==0)?'输入丢失设置':'input lost Config',
		                      items:[{
	                    	   fieldLabel:(lang.flag==0)?'关闭输出':'Stop Output',
	                         xtype:'checkbox',
	                         checked:(stopOutput.output==0)? false:true,
	                         handler:function()
	                         {
	                           if (this.getValue())
	                            {
	                           jsonrpc.option.setStopOutput({stopOutput:1});
	                            }	
	                            else
	                            {
	                           jsonrpc.option.setStopOutput({stopOutput:0});
	                            }
	                            
	                            messagegrid.addMsg(0,((lang.flag)==0)?"成功修改输出!":"Successfully modify output!");
	                         }
	                       }]
                       },{
                    	      xtype:'fieldset',
		                    bodyStyle:'text-align:center;paddingLeft:18%;',
		                    title:(lang.flag==0)?'空包设置':'Null Pkt Config',
		                    items:[{
	                    	   fieldLabel:(lang.flag==0)?'关闭空包':'Stop Null Pkt',
	                         xtype:'checkbox',
	                         checked:(stopNullPkt.nullPkt==0)? false:true,
	                         handler:function()
	                         {
	                           if (this.getValue())
	                            {
	                           jsonrpc.option.setNullPkt({nullPkt:1});
	                            }	
	                            else
	                            {
	                           jsonrpc.option.setNullPkt({nullPkt:0});
	                            }
	                            
	                            messagegrid.addMsg(0,((lang.flag)==0)?"成功修改空包设置!":"Successfully modify Null Pkt!");
	                         }
	                       }]
                       },{
                    	      xtype:'fieldset',
				                    bodyStyle:'text-align:center;paddingLeft:18%;',
				                    title:(lang.flag==0)?'模式':'mode',
				                    items:[{
			                    	   fieldLabel:(lang.flag==0)?'高抖':'Hight jitter',
			                         xtype:'checkbox',
			                         checked:(broadcastMode.broadcastMode==0)? false:true,
			                         handler:function()
			                         {
			                           if (this.getValue())
			                            {
			                           jsonrpc.option.setBroadcastMode({broadcastMode:1});
			                            }
			                            else
			                            {
			                           jsonrpc.option.setBroadcastMode({broadcastMode:0});
			                            }
			                            
			                            messagegrid.addMsg(0,((lang.flag)==0)?"成功修改模式成功!":"Successfully modify broadcast mode!");
			                         }
	                       		}]
                       	}]
									},//到这里是设备参数里的选项设置结束
								{
								title: (lang.flag==0)? 'Trap设置':'TrapSettings',
                   height:650,
                   id:'Trap_Settings',
                   tools: tools,
                   layout:'form',
                   items:[{
									    bodyStyle:'margin-top:2%;margin-bottom:2%;',
									    border:false,
									    layout:'column',
									    items:[{
									    	bodyStyle:'background-color:transparent;',
									    	border:false,
									    	columnWidth:.25,
									    	items:[{
									    		style:'text-align:right',
									    		items:[totalEnabelLabel]
									    	}]
									    },{
									    	bodyStyle:'background-color:transparent;',
									    	border:false,
									      columnWidth:.25,
									    	items:[totalEnabelCheckBox]
									    },{
									    	bodyStyle:'background-color:transparent;',
									    	border:false,
									  	  columnWidth:.25,
									    	items:[{
									    		style:'text-align:right;paddingTop:3',
									    		items:[intervalLabel]
									    	}]
									    },{
									    	bodyStyle:'background-color:transparent;',
									    	border:false,
									  	  columnWidth:.25,
									    	items:[intervalField]
									  	}]
                    },{
                    xtype:'fieldset',
                    bodyStyle:'text-align:center;paddingLeft:18%;',
                    title:'Trap v1',
                    items:[{
			                    id:'trapV1_enable_id',
													fieldLabel:(lang.flag==0)?'使能':'enable',
													xtype:'checkbox',
													checked:(trapParams.traps[0].enable==0)? false:true
	           					 },trapVer1TypeGroup,{
                         id:'trapV1_ip_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'IP地址':'IP Addr',
                         value:trapParams.traps[0].ip,
                         regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		                     regexText : (lang.flag==0) ? 'IP输入非法' : 'Invalid IP',
                         listeners:{
                          specialkey : function(field, e){
													  if(e.getKey() == Ext.EventObject.ENTER){
															 getCmp('trapV1_ip_id').focus(true,true);
													  } 
								          }
							          }
                    },{
                         id:'trapV1_port_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'端口':'Port',
                         value:trapParams.traps[0].port,
                         regex :/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
                         regexText : (lang.flag==0) ? '端口输入非法' : 'Invalid Port',
                         listeners:{
                            specialkey : function(field, e){
															if(e.getKey() == Ext.EventObject.ENTER){
																getCmp('trapV1_port_id').focus(true,true);
															}
														}
												 }
                    }]
                  },{
                    xtype:'fieldset',
                    bodyStyle:'text-align:center;paddingLeft:18%;',
                    title:'Trap v2',
                    items:[{
                        id:'trapV2_enable_id',
								        fieldLabel:(lang.flag==0)?'使能':'enable',
												xtype:'checkbox',
												checked:(trapParams.traps[1].enable==0)? false:true
	            			},trapVer2TypeGroup,{
                         id:'trapV2_ip_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'IP地址':'IP Addr',
                         value:trapParams.traps[1].ip,
                         regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		                     regexText : (lang.flag==0) ? 'IP输入非法' : 'Invalid IP',
                         listeners:{
                          specialkey : function(field, e){
													  if(e.getKey() == Ext.EventObject.ENTER){
															 getCmp('trapV2_ip_id').focus(true,true);
													  } 
								          }
							          }
                    },{
                         id:'trapV2_port_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'端口':'Port',
                         value:trapParams.traps[1].port,
                         regex :/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
                         regexText : (lang.flag==0) ? '端口输入非法' : 'Invalid Port',
                         listeners:{
                            specialkey : function(field, e){
															if(e.getKey() == Ext.EventObject.ENTER){
																getCmp('trapV2_port_id').focus(true,true);
															}
														}
												 }
                    }]
                  },{
                    xtype:'fieldset',
                    bodyStyle:'text-align:center;paddingLeft:18%;',
                    title:'Trap Inform1',
                    items:[{
                        id:'trapInform1_enable_id',
												fieldLabel:(lang.flag==0)?'使能':'enable',
												xtype:'checkbox',
												checked:(trapParams.traps[2].enable==0)? false:true
	            			},{
                         id:'trapInform1_ip_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'IP地址':'IP Addr',
                         value:trapParams.traps[2].ip,
                         regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		                     regexText : (lang.flag==0) ? 'IP输入非法' : 'Invalid IP',
                         listeners:{
                          specialkey : function(field, e){
													  if(e.getKey() == Ext.EventObject.ENTER){
															 getCmp('trapInform1_ip_id').focus(true,true);
													  } 
								          }
							          }
                    },{
                         id:'trapInform1_port_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'端口':'Port',
                         value:trapParams.traps[2].port,
                         regex :/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
                         regexText : (lang.flag==0) ? '端口输入非法' : 'Invalid Port',
                         listeners:{
                            specialkey : function(field, e){
															if(e.getKey() == Ext.EventObject.ENTER){
																getCmp('trapInform2_port_id').focus(true,true);
															}
														}
												 }
                    }]
                  },{
                    xtype:'fieldset',
                    bodyStyle:'text-align:center;paddingLeft:18%;',
                    title:'Trap Inform2',
                    items:[{
                        id:'trapInform2_enable_id',
												fieldLabel:(lang.flag==0)?'使能':'enable',
												xtype:'checkbox',
												checked:(trapParams.traps[3].enable==0)? false:true
	            			},{
                         id:'trapInform2_ip_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'IP地址':'IP Addr',
                         value:trapParams.traps[3].ip,
                         regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		                     regexText : (lang.flag==0) ? 'IP输入非法' : 'Invalid IP',
                         listeners:{
                          specialkey : function(field, e){
													  if(e.getKey() == Ext.EventObject.ENTER){
															 getCmp('trapInform2_ip_id').focus(true,true);
													  } 
								          }
							          }
                    },{
                         id:'trapInform2_port_id',
                         xtype:'textfield',
                         allowBlank:false,
                         fieldLabel:(lang.flag==0)?'端口':'Port',
                         value:trapParams.traps[3].port,
                         regex :/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
                         regexText : (lang.flag==0) ? '端口输入非法' : 'Invalid Port',
                         listeners:{
                            specialkey : function(field, e){
															if(e.getKey() == Ext.EventObject.ENTER){
																getCmp('trapInform2_port_id').focus(true,true);
															}
														}
												 }
                    }]	
                  },{
                         xtype:'button',
                         width:100,
                         height:10,
                         style:'margin-left:40%',
                         text:(lang.flag==0)?'确认':'Confirm',
                         handler:function()
												 {
												    setTrapParams();
                            messagegrid.addMsg(0,((lang.flag)==0)?"成功修改trap参数设置!":"Successfully modify trap param settings!");
												 }
                    }]}//到这里是设备参数里的trap设置结束
					]}//到这里是设备参数结束
					]})//到这里是页面中所有item结束)//到这里是最大的tabpanel结束
			]//到这里，布局的中间部分结束
			},{
          region:'south',
          xtype:'label',
          cls:'copyright',
          text:'Copyright @ 2000-2009 Circloop Inc. All rights reserved'	
        }]
    });
    
    if (userMode.flag == 0)
    {   
    	Ext.getCmp('userTablePanel_id').remove('add_u_panel');   
    	Ext.getCmp('userTablePanel_id').remove('userListPanel');    
    }

	if(typeof (EventSource) !== "undefined")
        {
            document.getElementById("serverTime").innerHTML="可以使用sse" + "<br/>";
//            新建一个消息源，括号中是消息源的url
            var source = new EventSource("../cgi-bin/capture");
//            EventSource对象建立之后，浏览器会开始对url地址发送过来的事件进行监听
//            对onmessage事件进行监听
            source.onmessage=function (event) {
				               document.getElementById("serverTime").innerHTML+=event.data + "<br/>";
            };

        }
        else
        {
            document.getElementById("serverTime").innerHTML = "对不起，您的浏览器不支持Server-sent Event";
        }});

