<template>
    <a-col :xxl="{ span: 8 }" :lg="{ span: 12 }" :sm="{ span: 24 }" style="padding: .1rem">
        <a-card :title="title" :bordered="true">
            <a-table :columns="columns" :data-source="data" style="text-align: center;" >
                <template #headerCell="{ column }">
                    <span>
                    {{column.name}}
                    </span>
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'img'">
                        <a-image
                        :width="150"
                        :height="300"
                        :src="record.img"
                        />
                    </template>
                    <template v-else-if="column.key === 'presellDate'">
                        <span>
                        {{record.presellDate?record.presellDate:'非预售'}}
                        </span>
                    </template>
                    <template v-else-if="column.key === 'residueDay'">
                        <span>
                        {{record.residueDay?record.residueDay:'非预售'}}
                        </span>
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <span>
                            <a-button type="link" @click="handleClick(record.id)">查看详情</a-button>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </a-col>
</template>

<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
export default {
  name: 'CardTable',
  components: {
    SmileOutlined,
    DownOutlined,
  },
  props:['data','title'],
  data() {
    return {
        columns:[
            {
                name: "商品名称",
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
            },
            {
                name: '价格',
                dataIndex: 'amount',
                key: 'amount',
                ellipsis: true,
            },
            {
                name: '预售日期',
                dataIndex: 'presellDate',
                key: 'presellDate',
                ellipsis: true,
            },
            {
                name: '操作',
                dataIndex: 'action',
                key: 'action',
            }
        ]
    }
  },
  mounted() {
    
  },
  methods: {
    handleClick(id){
        this.$emit("getDetails",id)
    }
  },
}
</script>

