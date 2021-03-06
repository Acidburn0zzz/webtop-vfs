/**
 * This class is generated by jOOQ
 */
package com.sonicle.webtop.vfs.jooq;

/**
 * A class modelling foreign key relationships between tables of the <code>vfs</code> 
 * schema
 */
@javax.annotation.Generated(
	value = {
		"http://www.jooq.org",
		"jOOQ version:3.5.3"
	},
	comments = "This class is generated by jOOQ"
)
@java.lang.SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Keys {

	// -------------------------------------------------------------------------
	// IDENTITY definitions
	// -------------------------------------------------------------------------

	public static final org.jooq.Identity<com.sonicle.webtop.vfs.jooq.tables.records.StoresRecord, java.lang.Integer> IDENTITY_STORES = Identities0.IDENTITY_STORES;

	// -------------------------------------------------------------------------
	// UNIQUE and PRIMARY KEY definitions
	// -------------------------------------------------------------------------

	public static final org.jooq.UniqueKey<com.sonicle.webtop.vfs.jooq.tables.records.SharingLinksRecord> SHARING_LINKS_PKEY1 = UniqueKeys0.SHARING_LINKS_PKEY1;
	public static final org.jooq.UniqueKey<com.sonicle.webtop.vfs.jooq.tables.records.StoresRecord> STORES_PKEY = UniqueKeys0.STORES_PKEY;

	// -------------------------------------------------------------------------
	// FOREIGN KEY definitions
	// -------------------------------------------------------------------------


	// -------------------------------------------------------------------------
	// [#1459] distribute members to avoid static initialisers > 64kb
	// -------------------------------------------------------------------------

	private static class Identities0 extends org.jooq.impl.AbstractKeys {
		public static org.jooq.Identity<com.sonicle.webtop.vfs.jooq.tables.records.StoresRecord, java.lang.Integer> IDENTITY_STORES = createIdentity(com.sonicle.webtop.vfs.jooq.tables.Stores.STORES, com.sonicle.webtop.vfs.jooq.tables.Stores.STORES.STORE_ID);
	}

	private static class UniqueKeys0 extends org.jooq.impl.AbstractKeys {
		public static final org.jooq.UniqueKey<com.sonicle.webtop.vfs.jooq.tables.records.SharingLinksRecord> SHARING_LINKS_PKEY1 = createUniqueKey(com.sonicle.webtop.vfs.jooq.tables.SharingLinks.SHARING_LINKS, com.sonicle.webtop.vfs.jooq.tables.SharingLinks.SHARING_LINKS.SHARING_LINK_ID);
		public static final org.jooq.UniqueKey<com.sonicle.webtop.vfs.jooq.tables.records.StoresRecord> STORES_PKEY = createUniqueKey(com.sonicle.webtop.vfs.jooq.tables.Stores.STORES, com.sonicle.webtop.vfs.jooq.tables.Stores.STORES.STORE_ID);
	}
}
