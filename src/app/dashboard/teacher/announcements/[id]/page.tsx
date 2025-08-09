"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditAnnouncement() {
    const router = useRouter()
    const { id } = useParams() as { id: string }

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/announcements/${id}`)
            if (res.ok) {
                const data = await res.json()
                setTitle(data.title)
                setContent(data.content)
            }
            setLoading(false)
        }
        if (id) fetchData()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await fetch(`/api/announcements/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        })
        router.push("/dashboard/teacher/announcements")
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Announcement</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border p-2 rounded h-40"
                    placeholder="Content"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Update
                </button>
            </form>
        </div>
    )
}
