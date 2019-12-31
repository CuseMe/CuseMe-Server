module.exports = {
    ParameterError: require('./ParameterError'),
    DatabaseError: require('./DatabaseError'),
    AuthorizationError: require('./NoUserError'),
    TokenExpiredError: require('./TokenExpiredError'),
    MissPasswordError: require('./MissPasswordError'),
    NotFoundError: require('./NotFoundError'),
    NotCreatedError: require('./NotCreatedError'),
    NotUpdatedError: require('./NotUpdatedError'),
    NotDeletedError: require('./NotDeletedError'),
    NoUserError: require('./NoUserError'),
    NoReferencedRowError: require('./NoReferencedRowError'),
    DuplicatedEntryError: require('./DuplicatedEntryError'),
};

