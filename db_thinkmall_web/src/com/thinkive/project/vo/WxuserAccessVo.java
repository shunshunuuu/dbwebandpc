package com.thinkive.project.vo;
/**
 * 微信用户访问信息
 * @类型名称：WxuserAccessVo
 * @说明：TODO
 * @创建者: 胡常建  
 * @创建时间: 2016年2月20日 上午10:56:16
 * @修改者: 胡常建  
 * @修改时间: 2016年2月20日 上午10:56:16
 */
public class WxuserAccessVo {
	private int count=0;
	private boolean permitAccess=true;
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public boolean isPermitAccess() {
		return permitAccess;
	}
	public void setPermitAccess(boolean permitAccess) {
		this.permitAccess = permitAccess;
	}
	
}
