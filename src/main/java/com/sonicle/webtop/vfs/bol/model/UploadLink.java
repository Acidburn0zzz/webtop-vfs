/*
 * webtop-vfs is a WebTop Service developed by Sonicle S.r.l.
 * Copyright (C) 2014 Sonicle S.r.l.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by
 * the Free Software Foundation with the addition of the following permission
 * added to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED
 * WORK IN WHICH THE COPYRIGHT IS OWNED BY SONICLE, SONICLE DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, see http://www.gnu.org/licenses or write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301 USA.
 *
 * You can contact Sonicle S.r.l. at email address sonicle@sonicle.com
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Powered by Sonicle WebTop" logo. If the display of the logo is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Powered by Sonicle WebTop".
 */
package com.sonicle.webtop.vfs.bol.model;

import com.sonicle.webtop.core.sdk.WTException;
import com.sonicle.webtop.vfs.bol.OSharingLink;
import org.joda.time.DateTime;
import org.jooq.tools.StringUtils;

/**
 *
 * @author malbinola
 */
public class UploadLink extends SharingLink {
	private String linkId;
	private String domainId;
	private String userId;
	private Integer storeId;
	private String filePath;
	private String fileHash;
	private DateTime createdOn;
	private DateTime expiresOn;
	private String authMode;
	private String password;
	
	public UploadLink() {}
	
	public UploadLink(OSharingLink o) {
		if(o == null) return;
		linkId = o.getSharingLinkId();
		domainId = o.getDomainId();
		userId = o.getUserId();
		storeId = o.getStoreId();
		filePath = o.getFilePath();
		fileHash = o.getFileHash();
		createdOn = o.getCreatedOn();
		expiresOn = o.getExpiresOn();
		authMode = o.getAuthMode();
		password = o.getPassword();
	}

	public String getLinkId() {
		return linkId;
	}

	public void setLinkId(String linkId) {
		this.linkId = linkId;
	}
	
	public String getDomainId() {
		return domainId;
	}

	public void setDomainId(String domainId) {
		this.domainId = domainId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	
	public String getFileHash() {
		return fileHash;
	}

	public void setFileHash(String fileHash) {
		this.fileHash = fileHash;
	}

	public DateTime getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(DateTime createdOn) {
		this.createdOn = createdOn;
	}

	public DateTime getExpiresOn() {
		return expiresOn;
	}

	public void setExpiresOn(DateTime expiresOn) {
		this.expiresOn = expiresOn;
	}

	public String getAuthMode() {
		return authMode;
	}

	public void setAuthMode(String authMode) {
		this.authMode = authMode;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public void validate() throws WTException {
		if(authMode == null) throw new WTException("Provide a value for authMode");
		if(authMode.equals(SharingLink.AUTH_MODE_PASSWORD) && StringUtils.isBlank(password)) {
			throw new WTException("Provide a value for password");
		}
	}
}