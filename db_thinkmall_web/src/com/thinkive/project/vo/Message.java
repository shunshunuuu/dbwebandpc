package com.thinkive.project.vo;

/**
 * ��Ϣ��
 * @author Ϳ����
 *
 */
public class Message {

	/** ��Ϣ��� */
	private String msgId;
	/** ��Ϣ���� */
	private String title ;
	/** ��Ϣ���� */
	private String content;
	/** ��Ϣ���� */
	private String msgType ;
	/** �ֻ�token */
	private String token;
	/** ��Ϣ����ʱ�� */
	private String createTime;
	
	public String getMsgId() {
		return msgId;
	}
	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	
	
	
}
