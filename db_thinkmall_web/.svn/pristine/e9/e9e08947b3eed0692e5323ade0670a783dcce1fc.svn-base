package com.thinkive.project.interceptor;

import java.util.ArrayList;

import org.apache.log4j.Logger;

import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.util.RSA;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

public class RsaInterceptor implements Interceptor
{

	private static Logger logger = Logger.getLogger(RsaInterceptor.class);
	
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("进入RSA拦截器");
		String modulus = RSA.getProperties("n");
		String publicExponent = RSA.getProperties("e");
		if(StringHelper.isBlank(modulus) || StringHelper.isBlank(publicExponent))
		{
			RSA.generateKeyPair();
			modulus = RSA.getProperties("n");
			publicExponent = RSA.getProperties("e");
		}
		DataRow dataRow = new DataRow();
		dataRow.set("modulus", modulus);
		dataRow.set("publicExponent", publicExponent);
		ArrayList dataList = new ArrayList();
		dataList.add(dataRow);
		Result resultVo = new Result();
		resultVo.setErr_no(0);
		resultVo.setErr_info("调用成功!");
		resultVo.setDataSetNum(1);
		resultVo.setFirstDataSetName("results");
		resultVo.setResult("results", dataList);
		return resultVo;
	}
	
}
