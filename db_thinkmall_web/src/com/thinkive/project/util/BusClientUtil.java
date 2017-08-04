package com.thinkive.project.util;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.client.Client;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.tbservice.constant.ErrorEnum;
import com.thinkive.tbservice.exception.CustomException;

/**
 * 描述: 接入服务器 单独 调接口
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Apr 24, 2014 
 * 创建时间: 5:49:00 PM
 */
public class BusClientUtil
{
	/**
	 * @功能：单独 调接口
	 * @author：黄圣宙(HUANGRONALDO)
	 * @time：Apr 24, 2014 5:53:17 PM
	 * @param funcNo --功能号
	 * @param data --入参
	 * @return Result 
	 */
	public static Result invoke(int funcNo, DataRow data){
		Client client = null;
		try
		{
			client = new Client(Configuration.getString("system.busKey"));
			Result result = client.invokeToResult(funcNo, data);
			return result ;
		}
		catch (Exception ex)
		{
			throw new CustomException(ErrorEnum.SYS_ERROR_CODE.getErrorNo());
		}
		finally
		{
			client = null;
		}
	}
	public static Result invoke(int funcNo, DataRow data, String busKey){
		if(StringHelper.isBlank(busKey)){
			busKey = Configuration.getString("system.busKey") ;
		}
		Client client = null;
		try
		{
			client = new Client(busKey);
			Result result = client.invokeToResult(funcNo, data);
			return result ;
		}
		catch (Exception ex)
		{
			throw new CustomException(ErrorEnum.SYS_ERROR_CODE.getErrorNo());
		}
		finally
		{
			client = null;
		}
	}

}