/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType('provider', ['cridential', 'google']);

  pgm.createTable('users', {
    id: {type: 'VARCHAR(255)', notNull: true, primaryKey: true},
    fullname: {type: 'VARCHAR(50)', notNull: true},
    avatar_initial: {type: 'VARCHAR(4)', notNull: true},
    email: {type: 'VARCHAR(255)', notNull: true, unique: true},
    password: {type: 'VARCHAR(255)'},
    auth_provider: {type: 'provider', notNull: true, default: 'cridential'},
    created_at: {type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')},
    updated_at: {type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')}
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('users');
  pgm.dropType('provider');
};