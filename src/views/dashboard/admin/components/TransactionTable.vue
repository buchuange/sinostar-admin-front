<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单编号" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.orderNo | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="订单金额" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.totalFee }}
      </template>
    </el-table-column>
    <el-table-column label="支付状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.statusDetail }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null,
      queryParams: {
        current: 1,
        size: 8
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList(this.queryParams).then(response => {
        this.list = response.data
      }
      )
    }
  }
}
</script>
