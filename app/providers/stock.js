import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {default as moment } from 'moment';//'../../node_modules/moment/moment';

export const CLOSE_INCREASE='CLOSE_INCREASE';
export const CLOSE_DECLINE='CLOSE_DECLINE';
//const moment=mo.default;

function getScript(url){
  let promise = new Promise(function(resolve, reject){
    var elem=document.createElement('script'),
        handler=function(e){
          elem.parentNode.removeChild(elem);
          handler=null;
          if ( e && e.type === "error") {
            reject(e.type);
          }
          resolve(e.type);
        };
    elem.src=url;
    elem.charset='gb2312';
    elem.addEventListener('load',handler);
    elem.addEventListener('error',handler);
    document.head.appendChild(elem);
  });
  return promise;
}
function procStock(stock){
	stock.isIncrease=stock.close>stock.last;
	stock.isDecline=stock.last>stock.close;
	stock.diff=stock.last?stock.close-stock.last:'-';
	if(stock.last===0 || stock.close===0){
		stock.percent='-';
	}else{
		stock.percent=Math.abs(stock.diff*100/stock.last).toFixed(2)+'%'
	}
}

@Injectable()
export class StockService {
  static get parameters(){
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
		this._data={};
  }
	isOpening(){
    let d=new Date(),day=d.getDay();
    if(day>0 && day<6){
      let start=moment({hour: 9, minute: 15}),
          end=moment({hour:15,minutes:15}),
          now = moment();
      if(now>start && now<end){
        return true;
      }
    }
    return false;
  }
  isRankingsValid(sort){
    let d=new Date(),day=d.getDay();
    if(day>0 && day<6){
      let start=moment({hour: 9, minute: 15}),
          end=moment({hour:15,minutes:15}),
          now = moment();
      if(now<start && this._data[sort].date){
        return true;
      }
      if(now>end && this._data[sort].date>end){
        return true;
      }
      return false;
    }else{
      
    }
  }
	getData(){
		return this._data;
	}
	findStocks(q){
		let url='http://smartbox.gtimg.cn/s3/?t=gp&q='+q;
		return getScript(url).then(()=>{
			var v=[];
			if(window.v_hint){
				let values=window.v_hint.split(/~GP-[A|B]\^/);
				window.v_hint=null;
				values.forEach(val=>{
					if(val){
						let line=val.split('~');
						if(line.length>3){
							v.push({
								city:line[0],
								codeS:line[1],
								name:line[2],
								code:line[0]+line[1]
							});
						}
					}
				});
			}
			return v;
		});
	}
	
  fetchDay(codes){
    let url='http://qt.gtimg.cn/q=';
    url=url+codes.join(',')+',';
    
		return getScript(url).then(()=>{
      codes.forEach(code=>{
          var varName='v_'+code;
          if(window[varName]){
            var values=window[varName].split('~');
            window[varName]=null;
						const date=new Date();
            var v={
              code:code,name:values[1],
              close:parseFloat(values[3]),
              last:parseFloat(values[4]),
              open:parseFloat(values[5]),
              volume:parseInt(values[6]),
              buy1:values[9],buy1Vol:values[10],
              buy2:values[11],buy2Vol:values[12],
              buy3:values[13],buy3Vol:values[14],
              buy4:values[15],buy4Vol:values[16],
              buy5:values[17],buy5Vol:values[18],
              sell1:values[19],sell1Vol:values[20],
              sell2:values[21],sell2Vol:values[22],
              sell3:values[23],sell3Vol:values[24],
              sell4:values[25],sell4Vol:values[26],
              sell5:values[27],sell5Vol:values[28],
              time:moment(values[30],'YYYYMMDDHHmmss').toDate(),
							high:values[33],low:values[34],
              amount:parseInt(values[37]),
              turnoverRate:values[38],
							date
            };
						procStock(v);
						if(code==='sh000001' || code.slice(0,5)==='sz399'){
						  v.avg=parseFloat(values[35].split('/')[0]);
            }else{
              v.avg=(v.amount/v.volume*100);//.toFixed(2);
            }
						//debugger
						this._data[code]=Object.assign(this._data[code]||{},v);
          }
        });
      });
  }
	
	fetchRankings(sort){
		let sr=sort===CLOSE_INCREASE?-1:1;
		let url='http://hqdigi2.eastmoney.com/EM_Quote2010NumericApplication/index.aspx?type=s&sortType=C&pageSize=100&page=1&jsName=quote_123&style=33&token=44c9d251add88e27b65ed86506f6e5da&sortRule='+sr;
    return getScript(url).then(()=>{
			if(window.quote_123){
        let rankings=window.quote_123.rank,r=[];
        window.quote_123=null;
				rankings.forEach(stock=>{
					let values=stock.split(','),
							t=values[0].substring(6),
              city=t==='1'?'sh':'sz',
							code=city+values[1];
          let v={
            code,
            name:values[2],
            last:parseFloat(values[3]),
            open:parseFloat(values[4]),
            close:parseFloat(values[5]),
            high:parseFloat(values[6]),
            low:parseFloat(values[7]),
            amount:parseInt(values[8]),
            volume:parseInt(values[9]),
          };
					procStock(v);
					r.push(code);
					this._data[code]=Object.assign(this._data[code]||{},v);
				});
				this._data[sort]={date:new Date(),data:r};
			}
		});
	}
	
	fetchMinutes(code){
		let url='http://data.gtimg.cn/flashdata/hushen/minute/'+code+'.js';
    return getScript(url).then(()=>{
      let minData=window.min_data;
      if(minData){
        window.min_data=null;
        let origin=minData.split('\n'),
						line,mData=[],total=0,price,
						volume,totalV,totalVolume=0;
        origin.shift();origin.shift();
        origin.forEach(function(m,i){
					line=m.split(' ');
          if(line.length>2){
            price=parseFloat(line[1]);
            totalV=parseInt(line[2]);
            volume=totalV-totalVolume;
            totalVolume=totalV;
            total+=price*volume;
            mData.push({price:price,volume:volume,avg_price:total/totalVolume});
          }
        });
				//debugger
        mData[0].totalVolume=totalVolume;
        if(mData.length<242){
          mData.push({price:-0.001,avg_price:-0.001});
        }
        this._data['m_'+code]=mData;
      }
    });
	}
	fetchKDays(code){
		let url='http://data.gtimg.cn/flashdata/hushen/latest/daily/'+code+'.js?maxage=43201';
    return getScript(url).then(()=>{
			let val=window.latest_daily_data;
      if(val){
        window.latest_daily_data=null;
        let origin=val.split('\n');
        origin.shift();
        let head=origin.shift();
        if(head){
          let t=head.split(' '),info={}; 
          t.forEach((v)=>{
            let key=v.split(':');
            if(key[0]==='start'){
              info.start=moment(key[1],'YYMMDD').toDate();
            }else{
              info[key[0]]=parseInt(key[1]);
            }
          });
          if(info.num){
            var kdata=[];
            for(var i=0;i<info.num;i++){
              t=origin[i].split(' ');
              kdata[i]={
                date:moment(t[0],'YYMMDD').toDate(),
                open:parseFloat(t[1]),
                close:parseFloat(t[2]),
                high:parseFloat(t[3]),
                low:parseFloat(t[4]),
                volume:parseInt(t[5])
              };
            }
            this._data['kd_'+code]=kdata;
            this._data['ks_'+code]=info;
            this.procKData(this._data['kd_'+code],0,info.num);
          }
        }
      }
    });
	}
	fetchKWeeks(code){
		let url='http://data.gtimg.cn/flashdata/hushen/weekly/'+code+'.js?maxage=43201';
    return getScript(url).then(()=>{
			let val=window.weekly_data;
      if(val){
        window.weekly_data=null;
        let origin=val.split('\n');
        origin.shift();
        var kdata=[],
						len=origin.length-1;
        for(var i=0;i<len;i++){
          let t=origin[i].split(' ');
          kdata[i]={
            date:moment(t[0],'YYMMDD').toDate(),
            open:parseFloat(t[1]),
            close:parseFloat(t[2]),
            high:parseFloat(t[3]),
            low:parseFloat(t[4]),
            volume:parseInt(t[5])
          };
        }
        this._data['kw_'+code]=kdata;
        this.procKData(this._data['kw_'+code],0,len);
      }
    });
	}
	fetchKMonths(code){
		let url='http://data.gtimg.cn/flashdata/hushen/monthly/'+code+'.js?maxage=43201';
    return getScript(url).then(()=>{
			let val=window.monthly_data;
      if(val){
				window.monthly_data=null;
        let origin=val.split('\n');
        origin.shift();
        var kdata=[],
						len=origin.length-1;
        for(var i=0;i<len;i++){
          let t=origin[i].split(' ');
          kdata[i]={
            date:moment(t[0],'YYMMDD').toDate(),
            open:parseFloat(t[1]),
            close:parseFloat(t[2]),
            high:parseFloat(t[3]),
            low:parseFloat(t[4]),
            volume:parseInt(t[5])
          };
        }
        this._data['km_'+code]=kdata;
        this.procKData(this._data['km_'+code],0,len);
      }
    });
	}
	setMA(d,num,start,end){
    var sum=0,prop='ma'+num;
    for(var i=1;i<=num;i++){
      sum+=d[start].close;
      d[start++][prop]=sum/i;
    }
    for(i=start;i<end;i++){
      sum+=d[i].close-d[i-num].close;
      d[i][prop]=sum/num;
    }
  }
	procKData(arr,start,count){
    this.setMA(arr, 5, start, count);
    this.setMA(arr, 10, start, count);
    this.setMA(arr, 20, start, count);
  }
	
  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('data/data.json').subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = this.processData(res.json());
        resolve(this.data);
      });
    });
  }

  processData(data) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions

    data.tracks = [];

    // loop through each day in the schedule
    data.schedule.forEach(day => {
      // loop through each timeline group in the day
      day.groups.forEach(group => {
        // loop through each session in the timeline group
        group.sessions.forEach(session => {
          this.processSession(data, session);
        });
      });
    });

    return data;
  }

  getTimeline(dayIndex, queryText='', excludeTracks=[], segment='all') {
    return this.load().then(data => {
      let day = data.schedule[dayIndex];
      day.shownSessions = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g,' ');
      let queryWords = queryText.split(' ').filter(w => w.trim().length);

      day.groups.forEach(group => {
        group.hide = true;

        group.sessions.forEach(session => {
          // check if this session should show or not
          this.filterSession(session, queryWords, excludeTracks, segment);

          if (!session.hide) {
            // if this session is not hidden then this group should show
            group.hide = false;
            day.shownSessions++;
          }
        });

      });

      return day;
    });
  }

  
	getNullStock(code){
		return {code,last:0}
	}
	hasStocks(codes){
		return codes.every(code=>this._data[code]);
	}
	hasRankings(sort){
		return !!this._data[sort]
	}
	getMinutes(code){
		return this._data['m_'+code];
	}
	getKDays(code){
		return this._data['kd_'+code];
	}
	getKWeeks(code){
		return this._data['kw_'+code];
	}
	getKMonths(code){
		return this._data['km_'+code];
	}
	getStock(code){
		return this._data[code];
	}
	getStocks(codes){
		return codes.map(code=>{
			let stock=this._data[code];
			return stock?stock:this.getNullStock(code);
		});
	}
	getStockRankings(sort){
	  if(this._data[sort]){
	    return this._data[sort].data.map(code=>this._data[code]);
	  }
	  return [];
	}
	
}