Event.simulateMouse=function(e,t){var i=Object.extend({pointerX:0,pointerY:0,buttons:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1},arguments[2]||{}),n=document.createEvent("MouseEvents");n.initMouseEvent(t,!0,!0,document.defaultView,i.buttons,i.pointerX,i.pointerY,i.pointerX,i.pointerY,i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,0,$(e)),this.mark&&Element.remove(this.mark),this.mark=document.createElement("div"),this.mark.appendChild(document.createTextNode(" ")),document.body.appendChild(this.mark),this.mark.style.position="absolute",this.mark.style.top=i.pointerY+"px",this.mark.style.left=i.pointerX+"px",this.mark.style.width="5px",this.mark.style.height="5px;",this.mark.style.borderTop="1px solid red;",this.mark.style.borderLeft="1px solid red;",this.step&&alert("["+(""+(new Date).getTime())+"] "+t+"/"+Test.Unit.inspect(i)),$(e).dispatchEvent(n)},Event.simulateKey=function(e,t){var i=Object.extend({ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:0,charCode:0},arguments[2]||{}),n=document.createEvent("KeyEvents");n.initKeyEvent(t,!0,!0,window,i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,i.keyCode,i.charCode),$(e).dispatchEvent(n)},Event.simulateKeys=function(e,t){for(var i=0;t.length>i;i++)Event.simulateKey(e,"keypress",{charCode:t.charCodeAt(i)})};var Test={};Test.Unit={},Test.Unit.inspect=Object.inspect,Test.Unit.Logger=Class.create(),Test.Unit.Logger.prototype={initialize:function(e){this.log=$(e),this.log&&this._createLogTable()},start:function(e){this.log&&(this.testName=e,this.lastLogLine=document.createElement("tr"),this.statusCell=document.createElement("td"),this.nameCell=document.createElement("td"),this.nameCell.className="nameCell",this.nameCell.appendChild(document.createTextNode(e)),this.messageCell=document.createElement("td"),this.lastLogLine.appendChild(this.statusCell),this.lastLogLine.appendChild(this.nameCell),this.lastLogLine.appendChild(this.messageCell),this.loglines.appendChild(this.lastLogLine))},finish:function(e,t){this.log&&(this.lastLogLine.className=e,this.statusCell.innerHTML=e,this.messageCell.innerHTML=this._toHTML(t),this.addLinksToResults())},message:function(e){this.log&&(this.messageCell.innerHTML=this._toHTML(e))},summary:function(e){this.log&&(this.logsummary.innerHTML=this._toHTML(e))},_createLogTable:function(){this.log.innerHTML='<div id="logsummary"></div><table id="logtable"><thead><tr><th>Status</th><th>Test</th><th>Message</th></tr></thead><tbody id="loglines"></tbody></table>',this.logsummary=$("logsummary"),this.loglines=$("loglines")},_toHTML:function(e){return e.escapeHTML().replace(/\n/g,"<br/>")},addLinksToResults:function(){$$("tr.failed .nameCell").each(function(e){e.title="Run only this test",Event.observe(e,"click",function(){window.location.search="?tests="+e.innerHTML})}),$$("tr.passed .nameCell").each(function(e){e.title="Run all tests",Event.observe(e,"click",function(){window.location.search=""})})}},Test.Unit.Runner=Class.create(),Test.Unit.Runner.prototype={initialize:function(e){if(this.options=Object.extend({testLog:"testlog"},arguments[1]||{}),this.options.resultsURL=this.parseResultsURLQueryParameter(),this.options.tests=this.parseTestsQueryParameter(),this.options.testLog&&(this.options.testLog=$(this.options.testLog)||null),this.options.tests){this.tests=[];for(var t=0;this.options.tests.length>t;t++)/^test/.test(this.options.tests[t])&&this.tests.push(new Test.Unit.Testcase(this.options.tests[t],e[this.options.tests[t]],e.setup,e.teardown))}else if(this.options.test)this.tests=[new Test.Unit.Testcase(this.options.test,e[this.options.test],e.setup,e.teardown)];else{this.tests=[];for(var i in e)/^test/.test(i)&&this.tests.push(new Test.Unit.Testcase(this.options.context?" -> "+this.options.titles[i]:i,e[i],e.setup,e.teardown))}this.currentTest=0,this.logger=new Test.Unit.Logger(this.options.testLog),setTimeout(this.runTests.bind(this),1e3)},parseResultsURLQueryParameter:function(){return window.location.search.parseQuery().resultsURL},parseTestsQueryParameter:function(){return window.location.search.parseQuery().tests?window.location.search.parseQuery().tests.split(","):void 0},getResult:function(){for(var e=!1,t=0;this.tests.length>t;t++){if(this.tests[t].errors>0)return"ERROR";this.tests[t].failures>0&&(e=!0)}return e?"FAILURE":"SUCCESS"},postResults:function(){this.options.resultsURL&&new Ajax.Request(this.options.resultsURL,{method:"get",parameters:"result="+this.getResult(),asynchronous:!1})},runTests:function(){var e=this.tests[this.currentTest];return e?(e.isWaiting||this.logger.start(e.name),e.run(),e.isWaiting?(this.logger.message("Waiting for "+e.timeToWait+"ms"),setTimeout(this.runTests.bind(this),e.timeToWait||1e3)):(this.logger.finish(e.status(),e.summary()),this.currentTest++,this.runTests()),void 0):(this.postResults(),this.logger.summary(this.summary()),void 0)},summary:function(){for(var e=0,t=0,i=0,n=0;this.tests.length>n;n++)e+=this.tests[n].assertions,t+=this.tests[n].failures,i+=this.tests[n].errors;return(this.options.context?this.options.context+": ":"")+this.tests.length+" tests, "+e+" assertions, "+t+" failures, "+i+" errors"}},Test.Unit.Assertions=Class.create(),Test.Unit.Assertions.prototype={initialize:function(){this.assertions=0,this.failures=0,this.errors=0,this.messages=[]},summary:function(){return this.assertions+" assertions, "+this.failures+" failures, "+this.errors+" errors"+"\n"+this.messages.join("\n")},pass:function(){this.assertions++},fail:function(e){this.failures++,this.messages.push("Failure: "+e)},info:function(e){this.messages.push("Info: "+e)},error:function(e){this.errors++,this.messages.push(e.name+": "+e.message+"("+Test.Unit.inspect(e)+")")},status:function(){return this.failures>0?"failed":this.errors>0?"error":"passed"},assert:function(e){var t=arguments[1]||'assert: got "'+Test.Unit.inspect(e)+'"';try{e?this.pass():this.fail(t)}catch(i){this.error(i)}},assertEqual:function(e,t){var i=arguments[2]||"assertEqual";try{e==t?this.pass():this.fail(i+': expected "'+Test.Unit.inspect(e)+'", actual "'+Test.Unit.inspect(t)+'"')}catch(n){this.error(n)}},assertInspect:function(e,t){var i=arguments[2]||"assertInspect";try{e==t.inspect()?this.pass():this.fail(i+': expected "'+Test.Unit.inspect(e)+'", actual "'+Test.Unit.inspect(t)+'"')}catch(n){this.error(n)}},assertEnumEqual:function(e,t){var i=arguments[2]||"assertEnumEqual";try{$A(e).length==$A(t).length&&e.zip(t).all(function(e){return e[0]==e[1]})?this.pass():this.fail(i+": expected "+Test.Unit.inspect(e)+", actual "+Test.Unit.inspect(t))}catch(n){this.error(n)}},assertNotEqual:function(e,t){var i=arguments[2]||"assertNotEqual";try{e!=t?this.pass():this.fail(i+': got "'+Test.Unit.inspect(t)+'"')}catch(n){this.error(n)}},assertIdentical:function(e,t){var i=arguments[2]||"assertIdentical";try{e===t?this.pass():this.fail(i+': expected "'+Test.Unit.inspect(e)+'", actual "'+Test.Unit.inspect(t)+'"')}catch(n){this.error(n)}},assertNotIdentical:function(e,t){var i=arguments[2]||"assertNotIdentical";try{e!==t?this.pass():this.fail(i+': expected "'+Test.Unit.inspect(e)+'", actual "'+Test.Unit.inspect(t)+'"')}catch(n){this.error(n)}},assertNull:function(e){var t=arguments[1]||"assertNull";try{null==e?this.pass():this.fail(t+': got "'+Test.Unit.inspect(e)+'"')}catch(i){this.error(i)}},assertMatch:function(e,t){var i=arguments[2]||"assertMatch",n=RegExp(e);try{n.exec(t)?this.pass():this.fail(i+' : regex: "'+Test.Unit.inspect(e)+" did not match: "+Test.Unit.inspect(t)+'"')}catch(r){this.error(r)}},assertHidden:function(e){var t=arguments[1]||"assertHidden";this.assertEqual("none",e.style.display,t)},assertNotNull:function(e){var t=arguments[1]||"assertNotNull";this.assert(null!=e,t)},assertType:function(e,t){var i=arguments[2]||"assertType";try{t.constructor==e?this.pass():this.fail(i+': expected "'+Test.Unit.inspect(e)+'", actual "'+t.constructor+'"')}catch(n){this.error(n)}},assertNotOfType:function(e,t){var i=arguments[2]||"assertNotOfType";try{t.constructor!=e?this.pass():this.fail(i+': expected "'+Test.Unit.inspect(e)+'", actual "'+t.constructor+'"')}catch(n){this.error(n)}},assertInstanceOf:function(e,t){var i=arguments[2]||"assertInstanceOf";try{t instanceof e?this.pass():this.fail(i+": object was not an instance of the expected type")}catch(n){this.error(n)}},assertNotInstanceOf:function(e,t){var i=arguments[2]||"assertNotInstanceOf";try{t instanceof e?this.fail(i+": object was an instance of the not expected type"):this.pass()}catch(n){this.error(n)}},assertRespondsTo:function(e,t){var i=arguments[2]||"assertRespondsTo";try{t[e]&&"function"==typeof t[e]?this.pass():this.fail(i+": object doesn't respond to ["+e+"]")}catch(n){this.error(n)}},assertReturnsTrue:function(e,t){var i=arguments[2]||"assertReturnsTrue";try{var n=t[e];n||(n=t["is"+e.charAt(0).toUpperCase()+e.slice(1)]),n()?this.pass():this.fail(i+": method returned false")}catch(r){this.error(r)}},assertReturnsFalse:function(e,t){var i=arguments[2]||"assertReturnsFalse";try{var n=t[e];n||(n=t["is"+e.charAt(0).toUpperCase()+e.slice(1)]),n()?this.fail(i+": method returned true"):this.pass()}catch(r){this.error(r)}},assertRaise:function(e,t){var i=arguments[2]||"assertRaise";try{t(),this.fail(i+": exception expected but none was raised")}catch(n){null==e||n.name==e?this.pass():this.error(n)}},assertElementsMatch:function(){var e=$A(arguments),t=$A(e.shift());return t.length!=e.length?(this.fail("assertElementsMatch: size mismatch: "+t.length+" elements, "+e.length+" expressions"),!1):(t.zip(e).all(function(e,t){var i=$(e.first()),n=e.last();return i.match(n)?!0:(this.fail("assertElementsMatch: (in index "+t+") expected "+n.inspect()+" but got "+i.inspect()),void 0)}.bind(this))&&this.pass(),void 0)},assertElementMatches:function(e,t){this.assertElementsMatch([e],t)},benchmark:function(e,t){var i=new Date;(t||1).times(e);var n=new Date-i;return this.info((arguments[2]||"Operation")+" finished "+t+" iterations in "+n/1e3+"s"),n},_isVisible:function(e){return e=$(e),e.parentNode?(this.assertNotNull(e),e.style&&"none"==Element.getStyle(e,"display")?!1:this._isVisible(e.parentNode)):!0},assertNotVisible:function(e){this.assert(!this._isVisible(e),Test.Unit.inspect(e)+" was not hidden and didn't have a hidden parent either. "+(""||arguments[1]))},assertVisible:function(e){this.assert(this._isVisible(e),Test.Unit.inspect(e)+" was not visible. "+(""||arguments[1]))},benchmark:function(e,t){var i=new Date;(t||1).times(e);var n=new Date-i;return this.info((arguments[2]||"Operation")+" finished "+t+" iterations in "+n/1e3+"s"),n}},Test.Unit.Testcase=Class.create(),Object.extend(Object.extend(Test.Unit.Testcase.prototype,Test.Unit.Assertions.prototype),{initialize:function(name,test,setup,teardown){Test.Unit.Assertions.prototype.initialize.bind(this)(),this.name=name,"string"==typeof test?(test=test.gsub(/(\.should[^\(]+\()/,"#{0}this,"),test=test.gsub(/(\.should[^\(]+)\(this,\)/,"#{1}(this)"),this.test=function(){eval("with(this){"+test+"}")}):this.test=test||function(){},this.setup=setup||function(){},this.teardown=teardown||function(){},this.isWaiting=!1,this.timeToWait=1e3},wait:function(e,t){this.isWaiting=!0,this.test=t,this.timeToWait=e},run:function(){try{try{this.isWaiting||this.setup.bind(this)(),this.isWaiting=!1,this.test.bind(this)()}finally{this.isWaiting||this.teardown.bind(this)()}}catch(e){this.error(e)}}}),Test.setupBDDExtensionMethods=function(){var e={shouldEqual:"assertEqual",shouldNotEqual:"assertNotEqual",shouldEqualEnum:"assertEnumEqual",shouldBeA:"assertType",shouldNotBeA:"assertNotOfType",shouldBeAn:"assertType",shouldNotBeAn:"assertNotOfType",shouldBeNull:"assertNull",shouldNotBeNull:"assertNotNull",shouldBe:"assertReturnsTrue",shouldNotBe:"assertReturnsFalse",shouldRespondTo:"assertRespondsTo"},t=function(e,t,i){this[e].apply(this,(t||[]).concat([i]))};Test.BDDMethods={},$H(e).each(function(e){Test.BDDMethods[e.key]=function(){var i=$A(arguments),n=i.shift();t.apply(n,[e.value,i,this])}}),[Array.prototype,String.prototype,Number.prototype,Boolean.prototype].each(function(e){Object.extend(e,Test.BDDMethods)})},Test.context=function(e,t,i){Test.setupBDDExtensionMethods();var n={},r={};for(specName in t)switch(specName){case"setup":case"teardown":n[specName]=t[specName];break;default:var s="test"+specName.gsub(/\s+/,"-").camelize(),o=(""+t[specName]).split("\n").slice(1);/^\{/.test(o[0])&&(o=o.slice(1)),o.pop(),o=o.map(function(e){return e.strip()}),n[s]=o.join("\n"),r[s]=specName}new Test.Unit.Runner(n,{titles:r,testLog:i||"testlog",context:e})};