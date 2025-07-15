import { DatabaseConnector, DatabaseConnectionConfig, DatabaseConnectionStatus, QueryResult, ConnectionError, QueryError, TimeoutError } from '@diagram/common';
import { MySQLConnector } from '../MySQLConnector';

describe('DatabaseConnector', () => {
  let connector: DatabaseConnector;
  let mockConfig: DatabaseConnectionConfig;

  beforeEach(() => {
    mockConfig = {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'test_db',
      username: 'test_user',
      password: 'test_password',
      connectionTimeout: 5000,
      queryTimeout: 10000,
      maxConnections: 10
    };
  });

  afterEach(async () => {
    if (connector && connector.isConnected()) {
      await connector.disconnect();
    }
  });

  describe('MySQL Connector', () => {
    beforeEach(() => {
      connector = new MySQLConnector();
    });

    describe('connect', () => {
      it('should connect successfully with valid config', async () => {
        await expect(connector.connect(mockConfig)).resolves.not.toThrow();
        expect(connector.isConnected()).toBe(true);
      });

      it('should throw ConnectionError with invalid host', async () => {
        const invalidConfig = { ...mockConfig, host: 'invalid-host' };
        await expect(connector.connect(invalidConfig)).rejects.toThrow(ConnectionError);
      });

      it('should throw ConnectionError with invalid port', async () => {
        const invalidConfig = { ...mockConfig, port: 99999 };
        await expect(connector.connect(invalidConfig)).rejects.toThrow(ConnectionError);
      });

      it('should throw ConnectionError with invalid credentials', async () => {
        const invalidConfig = { ...mockConfig, username: 'invalid', password: 'invalid' };
        await expect(connector.connect(invalidConfig)).rejects.toThrow(ConnectionError);
      });

      it('should timeout when connection takes too long', async () => {
        const timeoutConfig = { ...mockConfig, connectionTimeout: 100 };
        await expect(connector.connect(timeoutConfig)).rejects.toThrow(TimeoutError);
      });
    });

    describe('disconnect', () => {
      it('should disconnect successfully when connected', async () => {
        await connector.connect(mockConfig);
        await expect(connector.disconnect()).resolves.not.toThrow();
        expect(connector.isConnected()).toBe(false);
      });

      it('should not throw when disconnecting already disconnected connection', async () => {
        await expect(connector.disconnect()).resolves.not.toThrow();
      });
    });

    describe('isConnected', () => {
      it('should return false when not connected', () => {
        expect(connector.isConnected()).toBe(false);
      });

      it('should return true when connected', async () => {
        await connector.connect(mockConfig);
        expect(connector.isConnected()).toBe(true);
      });
    });

    describe('getStatus', () => {
      it('should return connection status', async () => {
        await connector.connect(mockConfig);
        const status: DatabaseConnectionStatus = connector.getStatus();
        
        expect(status).toHaveProperty('id');
        expect(status).toHaveProperty('isConnected');
        expect(status).toHaveProperty('connectionCount');
        expect(status).toHaveProperty('maxConnections');
        expect(status).toHaveProperty('activeQueries');
        expect(status.isConnected).toBe(true);
      });
    });

    describe('testConnection', () => {
      it('should return true for valid connection', async () => {
        await connector.connect(mockConfig);
        const result = await connector.testConnection();
        expect(result).toBe(true);
      });

      it('should return false for invalid connection', async () => {
        const result = await connector.testConnection();
        expect(result).toBe(false);
      });
    });

    describe('executeQuery', () => {
      beforeEach(async () => {
        await connector.connect(mockConfig);
      });

      it('should execute simple SELECT query successfully', async () => {
        const query = 'SELECT 1 as test_column';
        const result: QueryResult = await connector.executeQuery(query);
        
        expect(result).toHaveProperty('rows');
        expect(result).toHaveProperty('columns');
        expect(result).toHaveProperty('executionTime');
        expect(result).toHaveProperty('queryId');
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]).toHaveProperty('test_column', 1);
        expect(result.columns).toContain('test_column');
      });

      it('should execute parameterized query successfully', async () => {
        const query = 'SELECT ? as param_value';
        const params = ['test_value'];
        const result: QueryResult = await connector.executeQuery(query, params);
        
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]).toHaveProperty('param_value', 'test_value');
      });

      it('should throw QueryError for invalid SQL', async () => {
        const invalidQuery = 'INVALID SQL STATEMENT';
        await expect(connector.executeQuery(invalidQuery)).rejects.toThrow(QueryError);
      });

      it('should respect query timeout', async () => {
        const longQuery = 'SELECT SLEEP(2)';
        const options = { timeout: 1000 };
        await expect(connector.executeQuery(longQuery, [], options)).rejects.toThrow(TimeoutError);
      });

      it('should limit result rows when maxRows is specified', async () => {
        const query = 'SELECT 1 UNION SELECT 2 UNION SELECT 3';
        const options = { maxRows: 2 };
        const result: QueryResult = await connector.executeQuery(query, [], options);
        
        expect(result.rows).toHaveLength(2);
      });

      it('should throw error when not connected', async () => {
        await connector.disconnect();
        const query = 'SELECT 1';
        await expect(connector.executeQuery(query)).rejects.toThrow(ConnectionError);
      });
    });

    describe('getConnectionInfo', () => {
      it('should return connection configuration', async () => {
        await connector.connect(mockConfig);
        const info = connector.getConnectionInfo();
        
        expect(info.type).toBe(mockConfig.type);
        expect(info.host).toBe(mockConfig.host);
        expect(info.port).toBe(mockConfig.port);
        expect(info.database).toBe(mockConfig.database);
        expect(info.username).toBe(mockConfig.username);
        // 비밀번호는 보안상 마스킹되어야 함
        expect(info.password).toBe('****');
      });
    });
  });

  describe('Connection Pool Management', () => {
    beforeEach(() => {
      connector = new MySQLConnector();
    });

    it('should manage connection pool correctly', async () => {
      await connector.connect({ ...mockConfig, maxConnections: 5 });
      
      const status = connector.getStatus();
      expect(status.maxConnections).toBe(5);
      expect(status.connectionCount).toBeGreaterThan(0);
    });

    it('should handle concurrent queries within pool limits', async () => {
      await connector.connect({ ...mockConfig, maxConnections: 3 });
      
      const queries = Array.from({ length: 5 }, (_, i) => 
        connector.executeQuery(`SELECT ${i + 1} as query_number`)
      );
      
      const results = await Promise.all(queries);
      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.rows[0]).toHaveProperty('query_number', index + 1);
      });
    });
  });
}); 